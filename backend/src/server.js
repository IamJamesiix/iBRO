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
  origin: [
    'http://localhost:5173',
    'https://ibro-1.onrender.com',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(cookieParser())
app.use(express.urlencoded({limit: '50mb', extended: false}))

console.log(`this the node_env: ${process.env.CLIENT_URL}`);


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