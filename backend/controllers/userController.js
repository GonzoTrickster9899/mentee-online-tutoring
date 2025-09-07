import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModels.js"

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

export {registerUser, loginUser}