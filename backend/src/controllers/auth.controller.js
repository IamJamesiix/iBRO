import config from "../libs/env.js";
// import jwt from "jsonwebtoken"
import bcrypt, { hash } from "bcrypt"
import User from "../models/User.js"
import { sendWelcomeEmail } from "../email/emailHandler.js";
import { generateToken } from "../libs/utils.js";



export const signup = async (req, res) => {
    const { userName, fullName, email, password } = req.body
    try {
        if(!userName || !fullName || !email || !password ){
            return res.status(400).json("all fields are required")
        }
        if(password.length < 6){
            return res.status(400).json("password must be atleat 6 characters")
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json("user already exists")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName:fullName,
            userName:userName,
            email:email,
            password:hashedPassword
        })

        if (newUser){
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
            _id:newUser._id,
            userName:newUser.userName,
            fullName:newUser.fullName,
            email:newUser.email,
        })

        try {
            await sendWelcomeEmail( (await savedUser).email, (await savedUser).userName, config.CLIENT_URL)
        } catch (error) {
            console.log("From email length:", config.SMTP_USER.length); // Should be 27
            console.log("From email (with quotes):", `"${config.SMTP_USER}"`); // Look for spaces
            console.log("Trimmed:", config.SMTP_USER.trim()); // Remove any spaces
            console.log("SMTP_USER value:", config.SMTP_USER);
            console.log("❌ Failed to send welcome email");
            console.log("Status Code:", error.code);
            console.log("Error Array:", error.response?.body?.errors);
            console.log("Full Body:", error.response?.body);
        }
        }else{
            return res.status(400).json("invalid user data")
        }
        

    } catch (error) {
        console.log("error in signup control:", error);
        res.status(500).json("server error")
        
    }

}

export const login = async (req, res) => {
    const {email, password} = req.body

            if(!email || !password){
            return res.status(400).json("input credentials")
        }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json("invalid credentials")
        }
        const passwordCorrect = await bcrypt.compare(password, user.password)
        if(!passwordCorrect){
            return res.status(400).json("invalid credentials")
        }

        generateToken(user._id, res)

        res.status(201).json({
            _id:user._id,
            userName:user.userName,
            fullName:user.fullName,
            email:user.email,
        })
        
    } catch (error) {
        console.log("error in login control",error);
        res.status(500).json("internal server error")
    }

}

export const logout = async (req, res) => {
    res.cookie("jwt", "", {maxAge:0})
    res.status(201).json("logged out successfully")
}

export const deleteit = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clear the JWT cookie
        res.cookie("jwt", "", { maxAge: 0 });
        
        res.status(200).json({ message: "Account deleted successfully" });
        
    } catch (error) {
        console.log("error in delete account:", error);
        res.status(500).json({ message: "Server error" });
    }
}