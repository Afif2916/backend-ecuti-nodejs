import express from "express";
import { getCuti, getCutibyid, createCuti, approvalCuti, updateCuti, deleteCuti, getCutiSupervisorAdmin, getCutiAdminOnly } from "../controller/Cuti.js";
import { verifyUser, adminOnly, supervisorOnly } from "../middleware/AuthUser.js";

const router = express.Router();

//router untuk mendapatkan All Cuti kecuali user, user hanya mendapatkan cuti yang mereka miliki
router.get("/cuti", verifyUser, getCuti);
// router untuk mendapatkan cuti by id cuti
router.get("/cuti/:id", verifyUser, getCutibyid);
//router untuk mendapatkan cuti supervisor saja
router.get("/cutisupervisor/", verifyUser, supervisorOnly, getCutiSupervisorAdmin);
//router untuk mendapatkan cuti admin saja
router.get("/cutiadmin/", verifyUser, adminOnly, getCutiAdminOnly);
//router membuat pengajuan cuti
router.post("/cuti", verifyUser, createCuti);
//router untuk meng update cuti
router.patch("/cuti/:id", verifyUser, updateCuti);
//router untuk approve cuti
router.patch("/approvalcuti/:id", verifyUser, supervisorOnly, approvalCuti);
//router untuk menghapus cuti
router.delete("/cuti/:id", verifyUser, deleteCuti);

export default router;
