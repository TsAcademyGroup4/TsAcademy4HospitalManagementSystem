import express from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create a prescription → only DOCTOR can create
router.post(
    "/",
    authMiddleware,
    authorizeRoles("DOCTOR"),
    prescriptionController.createPrescription
);

// Get all prescriptions → ADMIN or PHARMACY
router.get(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN", "PHARMACY"),
    prescriptionController.getAllPrescriptions
);

// Get pending prescriptions (paid, not dispensed) → PHARMACY only
router.get(
    "/pending",
    authMiddleware,
    authorizeRoles("PHARMACY"),
    prescriptionController.getPendingPrescriptions
);

// Get unpaid prescriptions → BILLING or ADMIN
router.get(
    "/unpaid",
    authMiddleware,
    authorizeRoles("BILLING", "ADMIN"),
    prescriptionController.getUnpaidPrescriptions
);

// Get prescription by ID → all logged-in users can view
router.get(
    "/:id",
    authMiddleware,
    prescriptionController.getPrescriptionById
);

// Mark prescription as paid → only BILLING
router.post(
    "/:id/pay",
    authMiddleware,
    authorizeRoles("BILLING"),
    prescriptionController.markPrescriptionAsPaid
);

// Dispense prescription → only PHARMACY
router.post(
    "/:id/dispense",
    authMiddleware,
    authorizeRoles("PHARMACY"),
    prescriptionController.dispensePrescription
);

// Cancel prescription → DOCTOR or ADMIN
router.patch(
    "/:id/cancel",
    authMiddleware,
    authorizeRoles("DOCTOR", "ADMIN"),
    prescriptionController.cancelPrescription
);

export default router;