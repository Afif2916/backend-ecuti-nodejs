import express from "express"
import {
    getCuti,
    getCutibyid,
    createCuti,
    approvalCuti,
    updateCuti,
    deleteCuti
} from "../controller/Cuti.js"
import { verifyUser, adminOnly, supervisorOnly } from "../middleware/AuthUser.js"

const router = express.Router()

router.get('/cuti', verifyUser, getCuti)
router.get('/cuti/:id', verifyUser, getCutibyid)
router.post('/cuti', verifyUser, createCuti)
router.patch('/cuti/:id', verifyUser, updateCuti)
router.patch('/approvalcuti/:id', verifyUser,supervisorOnly, approvalCuti)
router.delete('/cuti/:id', verifyUser, deleteCuti)


export default router