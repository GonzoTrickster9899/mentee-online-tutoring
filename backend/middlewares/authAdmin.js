import jwt from "jsonwebtoken"

const authAdmin = async (req,res,next)=>{
    try {

        const {atoken} = req.headers
        if(!atoken){
            return res.json({sucess:false, message:"Not Authorized Please Login Again"})
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        if(token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASS){
            return res.json({success:false, message:"Not Authorized login again"})
        }
        next()

    } catch (error) {
        console.log(error)
        res.json({sucess:false, message:error.message})
    }
}

export default authAdmin