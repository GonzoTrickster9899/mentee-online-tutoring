import tutorModel from "../models/tutorModel.js"
import sessionModel from "../models/sessionModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cancelBooking, BookingNotFoundError, BookingPermissionError, BookingStateError } from "../services/bookingService.js";
import { isVerifiedPaid, slotsBookedFromSessions } from "../utils/bookingPayment.js";

const sendCancellationError = (res, error) => {
    if (error instanceof BookingNotFoundError) return res.status(404).json({success:false, message:error.message});
    if (error instanceof BookingPermissionError) return res.status(403).json({success:false, message:error.message});
    if (error instanceof BookingStateError) return res.status(409).json({success:false, message:error.message});
    console.error("Tutor cancellation failed", error);
    return res.status(500).json({success:false, message:"Unable to cancel session"});
}

// API for change availability
const changeAvailability = async (req,res)=>{
    try {
        const {tutId} = req.body

        const tutData = await tutorModel.findById(tutId)
        if(!tutData) return res.status(404).json({success:false, message:"Tutor not found"})
        await tutorModel.findByIdAndUpdate(tutId, {available: !tutData.available})

        res.json({success:true, message:"Availability changed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API for get tutors list
const tutorsList = async(req,res)=>{
    try {
        
        const [tutors, activeSessions] = await Promise.all([
            tutorModel.find({}).select(['-password','-email']).lean(),
            sessionModel.find({cancelled:false}).select('tutId slotDate slotTime cancelled').lean(),
        ])
        const slotsByTutor = activeSessions.reduce((result, session) => {
            result[session.tutId] ??= [];
            result[session.tutId].push(session);
            return result;
        }, {})
        const tutorsWithAuthoritativeSlots = tutors.map((tutor) => ({
            ...tutor,
            slots_booked:slotsBookedFromSessions(slotsByTutor[String(tutor._id)] || []),
        }))
        res.json({success:true, tutors:tutorsWithAuthoritativeSlots})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

// API FOR TUTOR LOGIN
const loginTutor = async (req, res) => {
    try {
        const {email, password} = req.body
        const tutor = await tutorModel.findOne({email})
        if(!tutor){
            return res.json({success:false, message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, tutor.password)

        if(isMatch){
            const token = jwt.sign({id: tutor._id}, process.env.JWT_SECRET)

            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// API TO GET TUTOR SESSIONS FOR TUTOR PANEL
const sessionsTutor = async(req,res)=>{
    try{
        const tutId = req.userId
        const sessions = await sessionModel.find({tutId})

        res.json({success:true, sessions})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// API MARK THE SESSION COMPLETED FOR TUTOR PANEL
const sessionComplete = async(req, res)=>{
    try {
        const tutId = req.userId
        const {sessionId} = req.body
        const sessionData = await sessionModel.findById(sessionId)
        if(sessionData && sessionData.tutId === tutId && !sessionData.cancelled && isVerifiedPaid(sessionData)){
            await sessionModel.findByIdAndUpdate(sessionId, {isCompleted:true})
            return res.json({success:true, message:"Session Completed"})
        } else {
            return res.status(409).json({success:false, message: "Only paid, active sessions can be completed"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    
    }
}

// API MARK THE SESSION CANCELLED FOR TUTOR PANEL
const sessionCancel = async(req, res)=>{
    try {
        const {sessionId} = req.body
        const result = await cancelBooking({
            models:{tutorModel, sessionModel},
            sessionId,
            actor:{role:"tutor", id:req.userId},
        })
        return res.json({success:true, message:result.idempotent ? "Session was already cancelled" : "Session Cancelled", session:result.session, idempotent:result.idempotent})
    } catch (error) {
        sendCancellationError(res, error)

    }
}

// API TO GET DASHBOARD DATA FROM TUTOR PANEL
const tutorDashboard = async(req,res)=>{
    try {
        const tutId = req.userId
        const sessions = await sessionModel.find({tutId}).sort({date:-1})
        let earnings = 0
        let clients = []
        sessions.map((session)=>{
            if(!clients.includes(session.userId)){
                clients.push(session.userId)
            }
            if(session.isCompleted && isVerifiedPaid(session)){
                earnings += session.amount
            }
        })

        const dashData = {
            earnings,
            sessions:sessions.length,
            clients:clients.length,
            latestSessions:sessions.slice(0,5)
        }

        res.json({success:true, dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API TO GET TUTOR PROFILE FOR TUTOR PANEL
const tutorProfile = async(req,res)=>{
    try {
        const tutId = req.userId
        const profileData = await tutorModel.findById(tutId).select('-password')
        
        res.json({success:true, profileData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// API TO UPDATE TUTOR PROFILE FOR TUTOR PANEL
const updateTutorProfile = async(req,res)=>{
    try {
        const tutId = req.userId
        const {fees, address, available} = req.body
        const numericFees = Number(fees)
        if(!Number.isFinite(numericFees) || numericFees <= 0 || numericFees > 100000){
            return res.status(400).json({success:false, message:"Fees must be a positive amount"})
        }
        if(!address || typeof address !== "object" || typeof address.city !== "string" || typeof address.country !== "string"){
            return res.status(400).json({success:false, message:"A city and country are required"})
        }
        if(typeof available !== "boolean") return res.status(400).json({success:false, message:"Availability must be a boolean"})
        
        await tutorModel.findByIdAndUpdate(tutId, {fees:numericFees, address:{city:address.city.trim(), country:address.country.trim()}, available})

        res.json({success:true, message:"Profile Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

export {changeAvailability, tutorsList, loginTutor, sessionsTutor, sessionComplete, sessionCancel, tutorDashboard, tutorProfile, updateTutorProfile}
