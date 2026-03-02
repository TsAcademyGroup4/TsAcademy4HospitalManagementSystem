import express from "express";
import prescriptionController from "../controllers/prescriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create a prescription → only DOCTOR can create
router.post(
    "/",
    authMiddleware,
    authorizeRoles("DOCTOR"),
    prescriptionController.create
);

// Get all prescriptions → ADMIN or PHARMACY
router.get(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN", "PHARMACY"),
    prescriptionController.getAll
);

// Get pending prescriptions (paid, not dispensed) → PHARMACY only
router.get(
    "/pending",
    authMiddleware,
    authorizeRoles("PHARMACY"),
    prescriptionController.getPending
);

// Get unpaid prescriptions → BILLING or ADMIN
router.get(
    "/unpaid",
    authMiddleware,
    authorizeRoles("BILLING", "ADMIN"),
    prescriptionController.getUnpaid
);

// Get prescription by ID → all logged-in users can view
router.get(
    "/:id",
    authMiddleware,
    prescriptionController.getById
);

// Mark prescription as paid → only BILLING
router.post(
    "/:id/pay",
    authMiddleware,
    authorizeRoles("BILLING"),
    prescriptionController.markPaid
);

// Dispense prescription → only PHARMACY
router.post(
    "/:id/dispense",
    authMiddleware,
    authorizeRoles("PHARMACY"),
    prescriptionController.dispense
);

// Cancel prescription → DOCTOR or ADMIN
router.patch(
    "/:id/cancel",
    authMiddleware,
    authorizeRoles("DOCTOR", "ADMIN"),
    prescriptionController.cancel
);

export default router;