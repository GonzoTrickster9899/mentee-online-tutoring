import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import tutorModel from "../models/tutorModel.js";
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
            password:hashedPassword,
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
        res.json({success:true, message:"Tutor Added"});

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

export { addTutor, loginAdmin };