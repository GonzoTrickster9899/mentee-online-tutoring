import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{ype:String, required:true, unique:true},
    password:{type:String, required:true},
    image:{type:String, default:true},
    qualification:{type:String, required:true},
    subject:{type:String, required:true},
    experience:{type:String, required:true},
    about:{type:String, required:true},
    available:{type:Boolean, default:true},
    fees:{type:Number, required:true},
    address:{type:Object, required:true},
    date:{type:Number, required:true},
    slots_booked:{type:Object, default:{}},
}, {minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel
