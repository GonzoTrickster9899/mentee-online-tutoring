import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModels.js"
import {v2 as cloudinary} from "cloudinary"

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

export {registerUser, loginUser, getProfile, updateProfile}