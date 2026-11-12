import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import tutorModel from "../models/tutorModel.js";
import sessionModel from "../models/sessionModel.js";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken"
import { cancelBooking, BookingNotFoundError, BookingStateError } from "../services/bookingService.js";
import { isVerifiedPaid } from "../utils/bookingPayment.js";

const sendAdminCancellationError = (res, error) => {
    if (error instanceof BookingNotFoundError) return res.status(404).json({success:false, message:error.message});
    if (error instanceof BookingStateError) return res.status(409).json({success:false, message:error.message});
    console.error("Admin cancellation failed", error);
    return res.status(500).json({success:false, message:"Unable to cancel session"});
}

// API FOR ADDING A TUTOR FOR ADMIN PANEL
const addTutor = async (req,res) =>{
    try{
        const {
            name,
            email,
            password,
            qualification,
            subject,
            experience,
            about,
            fees,
            address
        } = req.body

        const imageFile = req.file

        //console.log({name,email,password, qualification, subject, experience, about, fees, address}, imageFile)

        if(
            !name || 
            !email || 
            !password || 
            !qualification || 
            !subject || 
            !experience || 
            !about || 
            !fees || 
            !address
        ){
            return res.json({success:false, message:"Missing Details"});
        }
        if(!validator.isEmail(email)){
            return res.json({
                success:false, 
                message:"Please enter a valid email address",
            });
        }

        if(password.length < 8){
            return res.json({
                success:false, 
                message:"Please enter strong password",
            });
        }
        const numericFees = Number(fees)
        if(!Number.isFinite(numericFees) || numericFees <= 0 || numericFees > 100000){
            return res.status(400).json({success:false, message:"Fees must be a positive amount"})
        }
        
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Handling image
        let imageUrl = "";
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type:"image",
            });
            imageUrl = imageUpload.secure_url;
        } else {
            // provide a default image Url if no file is uploaded
            imageUrl = "https://placeholder.co/400"
        }

        const tutorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl, 
            qualification,
            subject,
            experience,
            about,
            fees:numericFees,
            address: JSON.parse(address),
            available: true,
            date: Date.now(),
        };

        const newTutor = new tutorModel(tutorData);
        await newTutor.save();
        
        res.json({success:true, message:"Tutor added successfully "});

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API FOR ADMIN LOGIN
const loginAdmin = async (req,res)=>{
    try {

        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid Credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API FOR GET ALL TUTORS LIST FOR THE ADMIN PANEL
const allTutors = async (req,res)=>{
    try {
        const tutors = await tutorModel.find({}).select("-password")
        res.json({success:true, tutors})
    } catch (error) {
        
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API TO GET ALL SESSION LIST
const sessionsAdmin = async (req, res) => {
    try {
        const sessions = await sessionModel.find({}).sort({date:-1});
        res.json({ success: true, sessions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API TO CANCEL THE SESSION
const sessionCancel  = async (req,res)=>{
    try{
        const {sessionId} = req.body
        const result = await cancelBooking({
            models:{tutorModel, sessionModel},
            sessionId,
            actor:{role:"admin"},
        })
        res.json({success:true, message:result.idempotent ? "Session was already cancelled" : "Session Cancelled", session:result.session, idempotent:result.idempotent})
    } catch (error) {
        sendAdminCancellationError(res, error)
    }
}

// API TO GET DASHBOARD DATA
const adminDashboard = async (req,res)=>{
    try{
        const tutors = await tutorModel.find({})
        const users = await userModel.find({})
        const sessions = await sessionModel.find({})
        const revenue = sessions.reduce((total, session) => (
            session.isCompleted && isVerifiedPaid(session) ? total + session.amount : total
        ), 0)

        const dashData = {
            tutors: tutors.length,
            sessions: sessions.length,
            clients: users.length,
            revenue,
            latestSessions: sessions.sort((a,b) => b.date - a.date).slice(0, 5)
        }

        res.json({success:true, dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export { addTutor, loginAdmin, allTutors, sessionsAdmin, sessionCancel, adminDashboard };
