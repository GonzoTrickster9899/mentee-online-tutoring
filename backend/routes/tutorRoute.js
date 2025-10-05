import express from "express"
import { loginTutor, tutorsList } from "../controllers/tutorController.js"

const tutorRouter =  express.Router()

tutorRouter.get('/list', tutorsList)
tutorRouter.post('/login', loginTutor)

export default tutorRouter