import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import tutorRouter from "./routes/tutorRoute.js"
import userRouter from "./routes/userRoute.js"
import { stripeWebhook } from "./controllers/userController.js"

const app = express() // Initialize Express application
const port = process.env.PORT || 4000

connectDB() // Establish connection to the database
connectCloudinary() // Setup cloudinary for image storage

// Stripe requires the unparsed request bytes for signature verification. This route must remain
// before express.json() and is intentionally not behind browser authentication or CORS middleware.
app.post('/api/user/stripe-webhook', express.raw({type:'application/json'}), stripeWebhook)

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
