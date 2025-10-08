import express from "express"
import { loginTutor, sessionsTutor, tutorsList, sessionCancel, sessionComplete, tutorDashboard } from "../controllers/tutorController.js"
import authTutor from "../middlewares/authTutor.js"

const tutorRouter =  express.Router()

tutorRouter.get('/list', tutorsList)
tutorRouter.post('/login', loginTutor)
tutorRouter.get('/sessions', authTutor, sessionsTutor)
tutorRouter.post('/complete-session', authTutor, sessionComplete)
tutorRouter.post('/cancel-session', authTutor, sessionCancel)
tutorRouter.get('/dashboard', authTutor, tutorDashboard)

export default tutorRouter