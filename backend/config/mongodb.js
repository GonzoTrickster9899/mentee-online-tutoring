import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected! CHECK!")
    } catch (error) {
        console.error("Database connection Failed! EKIX!", error.message)
    }
}

export default connectDB