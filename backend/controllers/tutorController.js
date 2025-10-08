import tutorModel from "../models/tutorModel.js"
import sessionModel from "../models/sessionModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// API for change availability
const changeAvailability = async (req,res)=>{
    try {
        const {tutId} = req.body

        const tutData = await tutorModel.findById(tutId)
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
        
        const tutors = await tutorModel.find({}).select(['-password','-email'])
        res.json({success:true, tutors})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

// APIC FOR TUTOR LOGIN
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
        if(sessionData && sessionData.tutId === tutId){
            await sessionModel.findByIdAndUpdate(sessionId, {isCompleted:true})
            return res.json({success:true, message:"Session Completed"})
        } else {
            return res.json({success:false, message: "Action Failed"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    
    }
}

// API MARK THE SESSION COMPLETED FOR TUTOR PANEL
const sessionCancel = async(req, res)=>{
    try {
        const tutId = req.userId
        const {sessionId} = req.body
        const sessionData = await sessionModel.findById(sessionId)
        if(sessionData && sessionData.tutId === tutId){
            await sessionModel.findByIdAndUpdate(sessionId, {cancelled:true})
            return res.json({success:true, message:"Session Cancelled"})
        } else {
            return res.json({success:false, message: "Action Failed"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// API TO GET DASHBOARD DATA FRO TUTOR PANEL
const tutorDashboard = async(req,res)=>{
    try {
        const tutId = req.userId
        const sessions = await sessionModel.find({tutId})
        let earnings = 0
        let clients = []
        sessions.map((session)=>{
            if(!clients.includes(session.userId)){
                clients.push(session.userId)
            }
            if(session.isCompleted){
                earnings += session.amount
            }
        })

        const dashData = {
            earnings,
            sessions:sessions.length,
            clients:clients.length,
            latestSessions:sessions.reverse().slice(0,5)
        }

        res.json({success:true, dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export {changeAvailability, tutorsList, loginTutor, sessionsTutor, sessionComplete, sessionCancel, tutorDashboard}