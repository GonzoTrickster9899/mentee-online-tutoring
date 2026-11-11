import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModels.js"
import tutorModel from "../models/tutorModel.js";
import sessionModel from "../models/sessionModel.js";
import {v2 as cloudinary} from "cloudinary"
import {
    BookingConflictError,
    BookingNotFoundError,
    BookingPermissionError,
    BookingStateError,
    BookingValidationError,
    cancelBooking,
    reserveBooking,
} from "../services/bookingService.js";
import {
    PaymentConfigurationError,
    StripeWebhookSignatureError,
    getStripeClient,
    parseStripeWebhook,
    processStripeEvent,
} from "../services/paymentService.js";
import { normalizeCurrency, paymentStatusForSession, toMinorUnits } from "../utils/bookingPayment.js";

const bookingModels = { tutorModel, userModel, sessionModel };

const sendBookingError = (res, error) => {
    if (error instanceof BookingValidationError) return res.status(400).json({success:false, message:error.message});
    if (error instanceof BookingPermissionError) return res.status(403).json({success:false, message:error.message});
    if (error instanceof BookingNotFoundError) return res.status(404).json({success:false, message:error.message});
    if (error instanceof BookingConflictError) return res.status(409).json({success:false, message:error.message});
    if (error instanceof BookingStateError) return res.status(409).json({success:false, message:error.message});
    console.error("Booking operation failed", error);
    return res.status(500).json({success:false, message:"Unable to complete the booking operation"});
}

// API TO REGISTER USER
const registerUser = async(req,res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.json({success:false, message:"Missing Credentials"})
        }

        // Checking if Email is Valid
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Email is not valid"})
        }

        // Checking the password strength
        if(password.length < 8){
            return res.json({success:false, message:"Enter a strong password"})
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password:hashPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true, token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API FOR USER LOGIN
const loginUser = async(req,res)=>{
    try {
        const {email, password} = req.body
        
        const user = await userModel.findOne({email})

        // Checking if user exists
        if(!user){
            return res.json({success:false, message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// API FOR GET USER PROFILE
const getProfile = async(req, res)=>{
    try {
        const userId = req.userId
        
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true, userData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API FOR UPDATE USER PROFILE
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const {name, phone, address, dob, gender} = req.body
        const imageFile = req.file

        if(!name || !phone || !dob || !gender){
            return res.json({success: false, message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})
        if(imageFile){
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageUrl})
        }
        res.json({success:true, message: "Profile Updated!"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API FOR BOOKS SESSION
const bookSession = async (req,res)=>{
    try {
        const userId = req.userId
        const {tutId, slotDate, slotTime} = req.body
        const session = await reserveBooking({
            models: bookingModels,
            userId,
            tutId,
            slotDate,
            slotTime,
            currency: process.env.CURRENCY,
        })
        res.status(201).json({success:true, message:"Session Booked", session})
        
    } catch (error) {
        sendBookingError(res, error)
    }
}

// API TO GET USE SESSIONS FOR FRONTEND 
const listSessions = async(req, res)=>{
    try{
        const userId = req.userId
        const sessions = await sessionModel.find({userId}).sort({date:-1})

        res.json({success:true, sessions})

    } catch (error) {
        console.log(error)
        res.json({success:false,  message:error.message})
    }
}

// API FOR CANCEL THE SESSION
const cancelSession  = async (req,res)=>{
    try{
        const {sessionId} = req.body
        const result = await cancelBooking({
            models: bookingModels,
            sessionId,
            actor:{role:"student", id:req.userId},
        })
        res.json({success:true, message:result.idempotent ? "Session was already cancelled" : "Session Cancelled", session:result.session, idempotent:result.idempotent})
    } catch (error) {
        sendBookingError(res, error)
    }
}

// API FOR STRIPE PAYMENT
const paymentStripe = async(req,res)=>{
    let claim
    try{
        const userId = req.userId
        const {sessionId} = req.body
        const sessionData = await sessionModel.findById(sessionId)
        if(!sessionData) return res.status(404).json({success:false, message:"Session not found"})
        if(String(sessionData.userId) !== String(userId)) return res.status(403).json({success:false, message:"You cannot pay for this session"})
        if(sessionData.cancelled || sessionData.isCompleted) return res.status(409).json({success:false, message:"Cancelled or completed sessions cannot be paid"})
        if(paymentStatusForSession(sessionData) === "paid") return res.status(409).json({success:false, message:"This session is already paid"})
        if(!["unpaid", "failed", "expired"].includes(paymentStatusForSession(sessionData))) {
            return res.status(409).json({success:false, message:"A payment checkout is already in progress"})
        }

        const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "")
        if(!frontendUrl) return res.status(503).json({success:false, message:"Payment checkout is not configured"})

        claim = await sessionModel.findOneAndUpdate(
            {
                _id:sessionId,
                userId,
                cancelled:false,
                isCompleted:false,
                payment:false,
                paymentStatus:{$in:["unpaid", "failed", "expired"]},
            },
            {$set:{paymentStatus:"checkout_creating"}, $inc:{checkoutAttempt:1}},
            {new:true},
        )
        if(!claim) return res.status(409).json({success:false, message:"Session payment state changed; refresh and try again"})

        const currency = normalizeCurrency(claim.currency || process.env.CURRENCY)
        const amountMinor = claim.amountMinor ?? toMinorUnits(claim.amount, currency)
        const stripe = getStripeClient()
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency:currency,
                        product_data:{
                            name: `Session with ${sessionData.tutData.name}`,
                            description: `Subject: ${sessionData.tutData.subject}`
                        },
                        unit_amount: amountMinor,
                    },
                    quantity: 1,
                }
            ],
            mode:'payment',
            metadata:{sessionId:String(claim._id), userId:String(userId)},
            client_reference_id:String(claim._id),
            success_url: `${frontendUrl}/my-sessions?checkout=success`,
            cancel_url: `${frontendUrl}/my-sessions?checkout=cancelled`,
        }, {idempotencyKey:`mentee-session-${claim._id}-${claim.checkoutAttempt}`})

        await sessionModel.findOneAndUpdate(
            {_id:claim._id, paymentStatus:"checkout_creating", checkoutAttempt:claim.checkoutAttempt},
            {$set:{
                paymentStatus:"checkout_created",
                stripeCheckoutSessionId:stripeSession.id,
                currency,
                amountMinor,
            }},
        )

        res.json({success:true, session_url:stripeSession.url})
    } catch (error) {
        console.error("Stripe checkout creation failed", error)
        if(claim){
            await sessionModel.updateOne(
                {_id:claim._id, paymentStatus:"checkout_creating", checkoutAttempt:claim.checkoutAttempt},
                {$set:{paymentStatus:"failed"}},
            )
        }
        if (error instanceof PaymentConfigurationError) return res.status(503).json({success:false, message:"Payment checkout is not configured"})
        res.status(500).json({success:false, message:"Unable to create payment checkout"})
    }
}

const stripeWebhook = async(req, res) => {
    try {
        const stripe = getStripeClient()
        const event = parseStripeWebhook({
            rawBody:req.body,
            signature:req.headers["stripe-signature"],
            secret:process.env.STRIPE_WEBHOOK_SECRET,
            stripeClient:stripe,
        })
        await processStripeEvent({event, sessionModel})
        res.status(200).json({received:true})
    } catch (error) {
        if(error instanceof StripeWebhookSignatureError) return res.status(400).json({received:false, message:"Invalid webhook signature"})
        console.error("Stripe webhook processing failed", error)
        res.status(500).json({received:false, message:"Webhook processing failed"})
    }
}

export {registerUser, loginUser, getProfile, updateProfile, bookSession, listSessions, cancelSession, paymentStripe, stripeWebhook}
