import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import tutorModel from "../models/tutorModel.js";
import sessionModel from "../models/sessionModel.js";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken"

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
            fees,
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
        const sessions = await sessionModel.find({});
        res.json({ success: true, sessions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API TO CANCEL THE SESSION
const sessionCancel  = async (req,res)=>{
    try{
        const userId = req.userId
        const {sessionId} = req.body
        const sessionData = await sessionModel.findById(sessionId)

        await sessionModel.findByIdAndUpdate(sessionId, {cancelled:true})

        // Release tutor slot
        const {tutId, slotDate, slotTime} = sessionData
        const tutData = await tutorModel.findById(tutId)

        let slots_booked = tutData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await tutorModel.findByIdAndUpdate(tutId, {slots_booked})

        res.json({success:true, message:"Session Cancelled"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API TO GET DASHBOARD DATA
const adminDashboard = async (req,res)=>{
    try{
        const tutors = await tutorModel.find({})
        const users = await userModel.find({})
        const sessions = await sessionModel.find({})

        const dashData = {
            tutors: tutors.length,
            sessions: sessions.length,
            clients: users.length,
            latestSessions: sessions.reverse().slice(0, 5)
        }

        res.json({success:true, dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export { addTutor, loginAdmin, allTutors, sessionsAdmin, sessionCancel, adminDashboard };