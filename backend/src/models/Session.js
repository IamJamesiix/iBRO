import mongoose from "mongoose";

const breakSchema = new mongoose.Schema({
  start: Date,
  end: Date
});

const sessionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, 
    targetHours: {
      type: Number,
      default: null,   
      min: 0
    },
    clockInTime: { 
        type: Date, 
        required: true 
    },
    clockOutTime: { 
        type: Date 
    },
    breaks: [breakSchema],
    totalBreakMillis: {
         type: Number, 
         default: 0 
        },
    status: { 
    type: String, 
    enum: ["working", "onBreak", "finished"], 
    default: "working" 
    },
    
})

const Session = mongoose.model('Session', sessionSchema)
export default Session