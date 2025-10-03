import express from 'express'
import {clockin, breakin, progress, resumein, clockout, deleteit, getUserSessions } from "../controllers/session.controller.js"


const router = express.Router()

router.post('/clockin', clockin)

router.post('/breakin', breakin )

router.get('/progress/:sessionId', progress)

router.post('/resumein', resumein)

router.post('/clockout', clockout)

router.delete('/:id', deleteit )

router.get('/user/:userId', getUserSessions)


export default router