import mongoose, { connect } from "mongoose"
import config from "../libs/env.js"


export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(config.MONGO_URI)
        console.log(connect.connection.host);
        

    } catch (error) {
        console.log(error);
        process.exit(1)        
    }
}


export default connectDB