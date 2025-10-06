import jwt from "jsonwebtoken"

// User authentication middleware

const authTutor = async (req,res,next)=>{
    try {

        const {ttoken} = req.headers
        if(!ttoken){
            return res.json({sucess:false, message:"Not Authorized Please Login Again"})
        }
        const token_decode = jwt.verify(ttoken, process.env.JWT_SECRET)

        req.userId = token_decode.id
        
        next()

    } catch (error) {
        console.log(error)
        res.json({sucess:false, message:error.message})
    }
}

export default authTutor