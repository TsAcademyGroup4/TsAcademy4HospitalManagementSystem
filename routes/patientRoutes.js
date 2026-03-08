import express from "express";
import * as patientController from "../controllers/patientController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";


const router = express.Router();

/**
 * @swagger
 * /api/v1/patient/register:
 *   post:
 *     summary: Register a new patient
 *     description: Create a new patient record in the system
 *     tags:
 *       - Patient Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dob
 *               - gender
 *               - phone
 *               - address
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: MALE
 *               phone:
 *                 type: string
 *                 example: "254712345678"
 *               address:
 *                 type: string
 *                 example: 123 Main St, Nairobi
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or patient already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/register", 
    authMiddleware,
    authorizeRoles("ADMIN", "RECEPTIONIST"),
    patientController.registerPatient
);

/**
 * @swagger
 * /api/v1/patient/search:
 *   get:
 *     summary: Search for patients
 *     description: Search patients by phone number and/or name
 *     tags:
 *       - Patient Management
 *     parameters:
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Patient phone number
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Patient first or last name
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    "/search", 
    authMiddleware,
    authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
    patientController.searchPatient
);

/**
 * @swagger
 * /api/v1/patient/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: Retrieve a patient record by patient ID or custom patient ID
 *     tags:
 *       - Patient Management
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID (e.g., 507f1f77bcf86cd799439011 or PAT-00001)
 *     responses:
 *       200:
 *         description: Patient record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", 
    authMiddleware,
    authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"),
    patientController.getPatientById
);

export default router;
