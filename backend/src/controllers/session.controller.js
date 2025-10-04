import mongoose from "mongoose"

import config from "../libs/env.js";
import User from "../models/User.js";
import Session from "../models/Session.js"




export const clockin = async (req, res) => {
    const { userId, targetHours }= req.body

    const newSession = new Session({
        userId,
        clockInTime: new Date(),
        status:"working",
        targetHours: targetHours || null 
    })

    await newSession.save()
    res.json( newSession)
}

export const breakin = async (req, res) => {
    const { sessionId } = req.body
    const session = await Session.findById(sessionId)
    if(!session || session.status!= "working") return res.status(400).json({ error: "Not working" });


    session.breaks.push({start: new Date()});
    session.status = "onBreak"
    await session.save()
    res.json(session)
}

export const progress = async (req, res) => {
    const session = await Session.findById(req.params.sessionId)
    if(!session) return res.status(404).json({error: 'session progress not found'})

    // if (!session.targetHours) {
    //     return res.status(400).json({ error: "No target set for this session" });
    // }

    if (!session.clockInTime) {
      return res.status(400).json({ error: "Session has no clockInTime" });
    }
        let now = new Date()
        let workedMillis = (now - session.clockInTime) - session.totalBreakMillis;


        if(session.status === "onBreak"){
            const lastBreak = session.breaks && session.breaks[session.breaks.length -1]
            if( lastBreak && !lastBreak.end){
                workedMillis -= (now - lastBreak.start);
            }
        }

        if (workedMillis < 0) workedMillis = 0;

        const hoursWorked = workedMillis/(1000*60*60)
        const minutesWorked = workedMillis / (1000 * 60);
        const secondsWorked = workedMillis / 1000;

        if(session.targetHours != null && session.targetHours > 0){
        const progressPercent = ((hoursWorked / session.targetHours) * 100).toFixed(2);
            return res.json({
            targetHours: session.targetHours,
            hoursWorked: hoursWorked.toFixed(2),
            minutesWorked: minutesWorked.toFixed(0),
            secondsWorked: secondsWorked.toFixed(0),
            progressPercent
            });
        }
        return res.json({
            hoursWorked: hoursWorked.toFixed(2),
            minutesWorked: minutesWorked.toFixed(0),
            secondsWorked: secondsWorked.toFixed(0),
        })
}

export const resumein = async (req, res) => {
    const {sessionId} = req.body
    const session = await Session.findById(sessionId)
    if(!session || session.status!= "onBreak")return res.status(400).json({ error: "Not on break" })

    let lastBreak = session.breaks[session.breaks.length -1]
    lastBreak.end = new Date()
    session.totalBreakMillis += (lastBreak.end - lastBreak.start)
    session.status="working"

    await session.save()
    res.json(session)
}

export const clockout = async (req, res) => {
    const { sessionId } = req.body
    const session = await Session.findById(sessionId)
    if(!session || session.status == "finished") return res.status(400).json({ error: "Already finished or invalid" })

    session.clockOutTime = new Date()
    session.status = "finished"

    let workedMillis = (session.clockOutTime - session.clockInTime) - session.totalBreakMillis;
    const hoursWorked = workedMillis/(1000*60*60)
    const minutesWorked = workedMillis / (1000 * 60);
    const secondsWorked = workedMillis / (1000);
    let progressPercent = null
    let achievement = 'none'
        
    const response = {
            session,
            hoursWorked: hoursWorked.toFixed(2),
            minutesWorked: minutesWorked.toFixed(2),
            secondsWorked: secondsWorked.toFixed(2),
            progressPercent,
            achievement: 'none'
    }

    if (session.targetHours) {
        const exactProgress = (hoursWorked / session.targetHours) * 100;
        response.targetHours = session.targetHours;
        response.progressPercent = exactProgress.toFixed(2);

        // Determine achievement based on progress
        if (exactProgress >= 99.5 && exactProgress <= 100.5) {
            // Perfect! Hit the target exactly (within 0.5% tolerance)
            achievement = 'perfect';
        } else if (exactProgress > 100.5) {
            // Overachiever! Exceeded the target
            achievement = 'overachiever';
        }

        // Save achievement to session
        session.achievement = achievement;
        session.achievementTime = new Date();
        response.achievement = achievement;
    }

    await session.save()
    res.json(response);
}

export const deleteit = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        if (!id) return res.status(400).json({ error: "id is required" });

    // validate ObjectId first
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id format" });
        }

    // optional: check existence first for clearer logs
        const existing = await Session.findById(id);
        if (!existing) {
            return res.status(404).json({ error: "Session not found" });
        }
        const deleted = await Session.findByIdAndDelete(id)

        if(!deleted){
            return res.status(404).json("session not found")
        }

        res.json({ message: "Session deleted successfully", session: deleted });
    } catch (err) {
        console.log(err);
        
    }
}

export const getUserSessions = async (req, res) => {
    try {
        const { userId } = req.params;
        const sessions = await Session.find({ userId })
            .sort({ clockInTime: -1 })
            .limit(20);
        res.json(sessions);
    } catch (error) {
        console.log("error in getUserSessions:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const getWeeklyStats = async (req, res) => {
  const { userId } = req.params;
  
  // Calculate start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  
  try {
    const sessions = await Session.find({
      userId,
      clockInTime: { $gte: startOfWeek }
    }).sort({ clockInTime: 1 });
    
    // Calculate stats
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'finished').length;
    
    let totalWorkedMillis = 0;
    let perfectCount = 0;
    let overachieverCount = 0;
    
    sessions.forEach(session => {
      if (session.clockOutTime) {
        totalWorkedMillis += (session.clockOutTime - session.clockInTime) - session.totalBreakMillis;
      }
      if (session.achievement === 'perfect') perfectCount++;
      if (session.achievement === 'overachiever') overachieverCount++;
    });
    
    const totalHours = (totalWorkedMillis / (1000 * 60 * 60)).toFixed(2);
    const avgSessionLength = completedSessions > 0 
      ? (totalWorkedMillis / completedSessions / (1000 * 60 * 60)).toFixed(2) 
      : 0;
    
    res.json({
      totalSessions,
      completedSessions,
      totalHours,
      avgSessionLength,
      perfectCount,
      overachieverCount,
      sessions
    });
  } catch (error) {
    console.log("Error in getWeeklyStats:", error);
    res.status(500).json({ error: "Server error" });
  }
}