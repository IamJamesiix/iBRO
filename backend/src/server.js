import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import cors from "cors"

import config from "../src/libs/env.js"
import {connectDB} from "./libs/db.js"
import authRoutes from './routes/auth.route.js'
import sessionRoutes from './routes/session.route.js'

const app = express()
const Port = config.PORT || process.env.PORT || 4080

app.use(express.json())
app.use(cors({
  origin: config.CLIENT_URL, // Vite's default port
  credentials: true
}));
app.use(cookieParser())
app.use(express.urlencoded({limit: '50mb', extended: false}))


app.get('/', (req, res) => {
    res.send("app is running")
    console.log("app working")
})

app.use('/ibro/auth', authRoutes )
app.use('/ibro/session', sessionRoutes)


app.listen( Port, async () => {
    console.log(`listening to port ${Port}`);
    await connectDB()
})