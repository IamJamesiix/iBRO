import jwt from "jsonwebtoken"
import config from "../libs/env.js"
import User from "../models/User.js"


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided!" })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET)
        if(!decoded)return res.status(401).json({message: "Unauthorized - invalid token!"})

        const user = await User.findById(decoded.userId).select("-password")
        if(!user)return res.status(401).json({message: "user not found"})


        req.user = user
        next()
    } catch (error) {
        console.log("protectRoute error",error);
        res.status(500).json('server freaking error')
        
    }
}