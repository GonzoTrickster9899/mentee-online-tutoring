import tutorModel from "../models/tutorModel.js"

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

export {changeAvailability, tutorsList}