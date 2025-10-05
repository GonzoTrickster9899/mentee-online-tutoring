import tutorModel from "../models/tutorModel.js"
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

export {changeAvailability, tutorsList, loginTutor}