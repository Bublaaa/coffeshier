import express from 'express'
import dotenv from 'dotenv'
import { connection } from './db/connection.js';
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express();

app.get("/", (req, res) => {
    res.send("Hello W")
})

// Prefix for auth routes "/api/auth/login"
app.use("/api/auth", authRoutes)

app.listen(3000, () => {
    connection()
    console.log("Server is running on port 3000")
})