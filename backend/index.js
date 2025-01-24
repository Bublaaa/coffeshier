import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connection } from './db/connection.js';
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5001


app.use(express.json()) // Allow to parse incoming requests with json "req.body"
app.use(cookieParser())
app.use("/api/auth", authRoutes) // Prefix for auth routes "/api/auth/login"

app.listen(port, () => {
    connection()
    console.log("Server is running on port:", port)
})