import jwt from "jsonwebtoken"
import config from "../libs/env.js"
import User from "../models/User.js"


export const protectRoute = async (req, res, next) => {
    console.log('🔐 protectRoute - Cookies:', req.cookies);
    console.log('🔐 protectRoute - JWT:', req.cookies?.jwt);
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided!" })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET)
        console.log('🔓 Decoded token:', decoded);
        if(!decoded)return res.status(401).json({message: "Unauthorized - invalid token!"})

        const user = await User.findById(decoded.userId).select("-password")
        console.log('👤 Found user:', user?._id)
        if(!user)return res.status(401).json({message: "user not found"})


        req.user = user
         console.log('✅ protectRoute passed, user:', req.user._id)
        next()
    } catch (error) {
        console.log("protectRoute error",error);
        console.log('❌ protectRoute error:', error.message)
        res.status(500).json('server freaking error')
        
    }
}