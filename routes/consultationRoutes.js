import express from "express";
import consultationController from "../controllers/consultationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create → DOCTOR or NURSE
router.post(
    "/",
    authMiddleware,
    authorizeRoles("DOCTOR", "NURSE"),
    consultationController.recordConsultation
);

// Get all → DOCTOR, NURSE, PHARMACY, ADMIN
router.get(
    "/",
    authMiddleware,
    authorizeRoles("DOCTOR", "NURSE", "PHARMACY", "ADMIN"),
    consultationController.getAllConsultations
)
// Get by ID → same as above
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("DOCTOR", "NURSE", "PHARMACY", "ADMIN"),
    consultationController.getConsultationById
);

// Update → DOCTOR only
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("DOCTOR"),
    consultationController.updateConsultationById
);

// Delete → ADMIN only
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    consultationController.deleteConsultationById
);

export default router;