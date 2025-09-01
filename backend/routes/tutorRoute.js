import express from "express"
import { tutorsList } from "../controllers/tutorController.js"

const tutorRouter =  express.Router()

tutorRouter.get('/list', tutorsList)

export default tutorRouter