import express from 'express'
import dotenv from 'dotenv'
import { connection } from './db/connection.js';
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5001

// Allow to parse incoming requests with json "req.body"
app.use(express.json())
// Prefix for auth routes "/api/auth/login"
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    connection()
    console.log("Server is running on port:", port)
})