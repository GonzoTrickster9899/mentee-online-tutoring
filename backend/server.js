import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import tutorRouter from "./routes/tutorRoute.js"
import userRouter from "./routes/userRoute.js"

const app = express() // Initialize Express application
const port = process.env.PORT || 4000

connectDB() // Establish connection to the database
connectCloudinary() // Setup cloudinary for image storage

// MiddLeware Setup
app.use(express.json()) // Enables JSON request body parsing
app.use(cors()) // ALLOWS cors origin requests

// Define API Routes
app.use('/api/admin', adminRouter)
app.use('/api/tutor', tutorRouter)
app.use('/api/user', userRouter)

// Root endpoint to check api status
app.get('/', (req, res)=>{
    res. send('API successfully connected!')
})

 // Start the server
app.listen(port, ()=>console.log(`Server is running on PORT: ${port}`))
