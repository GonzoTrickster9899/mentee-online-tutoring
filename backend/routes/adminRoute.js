import express from "express"
import { addTutor, loginAdmin } from "../controllers/tutorController.js"
import upload from "../middlewares/multer.js"
import authAdmin from "../middlewares/authAdmin.js"

const adminRouter = express.Router()

adminRouter.post('/add-tutor', authAdmin, upload.single('image'), addTutor)
adminRouter.post('/login', loginAdmin)

export default adminRouter