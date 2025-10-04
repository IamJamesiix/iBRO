import jwt from "jsonwebtoken"
import config from "./env.js"

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId:userId}, config.JWT_SECRET,{
        expiresIn: config.JWT_EXPIRES_IN
    })

    const { JWT_SECRET, NODE_ENV } = config
    if (!JWT_SECRET){
        throw new Error("JWT secret not configured")
    }

    const cookieOptions = {  // Define it first
        maxAge: 10*24*60*60*1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        
    };

    console.log('🍪 Setting cookie with options:', cookieOptions); // Now this works
    res.cookie("jwt", token, cookieOptions);
    
    return token;
}