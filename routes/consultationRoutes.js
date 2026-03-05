import express from "express";
import * as consultationController from "../controllers/consultationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/consultations:
 *   post:
 *     summary: Record a new consultation
 *     description: Create a new consultation record (Doctor/Nurse only)
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - consultationType
 *               - diagnosis
 *               - notes
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               doctorId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               consultationType:
 *                 type: string
 *                 enum: [GENERAL, FOLLOW_UP, EMERGENCY]
 *               diagnosis:
 *                 type: string
 *                 example: Hypertension with elevated BP
 *               notes:
 *                 type: string
 *                 example: Patient advised to reduce salt intake
 *     responses:
 *       201:
 *         description: Consultation recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all consultations
 *     description: Retrieve all consultations (Doctor, Nurse, Pharmacy, Admin)
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of consultations to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *         description: Number of consultations to skip
 *     responses:
 *       200:
 *         description: Consultations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    // authMiddleware,
    // authorizeRoles("DOCTOR", "NURSE"),
    consultationController.recordConsultation
);

router.get(
    "/",
    // authMiddleware,
    // authorizeRoles("DOCTOR", "NURSE", "PHARMACY", "ADMIN"),
    consultationController.getAllConsultations
);

/**
 * @swagger
 * /api/v1/consultations/{id}:
 *   get:
 *     summary: Get consultation by ID
 *     description: Retrieve a specific consultation record
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Consultation not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update consultation
 *     description: Update consultation details (Doctor only)
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *               consultationType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consultation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Consultation not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete consultation
 *     description: Remove a consultation record (Admin only)
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Consultation not found
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/:id",
    // authMiddleware,
    // authorizeRoles("DOCTOR", "NURSE", "PHARMACY", "ADMIN"),
    consultationController.getConsultationById
);

router.put(
    "/:id",
    // authMiddleware,
    // authorizeRoles("DOCTOR"),
    consultationController.updateConsultationById
);

router.delete(
    "/:id",
    // authMiddleware,
    // authorizeRoles("ADMIN"),
    consultationController.removeConsultationById
);

export default router;