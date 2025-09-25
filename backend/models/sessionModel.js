import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    tutId:{type:String, required:true},
    slotDate:{type:String, required:true},
    slotTime:{type:String, required:true},
    userData:{type:Object, required:true},
    tutData:{type:Object, required:true},
    amount:{type:Number, required:true},
    date:{type:Number, required:true},
    cancelled:{type:Boolean, default:false},
    payment:{type:Boolean, default:false},
    isCompleted:{type:Boolean, default:false},
})

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema)

export default sessionModel