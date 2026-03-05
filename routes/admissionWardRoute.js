import express from "express";
import * as admissionWardController from "../controllers/admissionWardController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admissions/available-beds:
 *   get:
 *     summary: Get available beds by ward type
 *     description: Retrieve list of available beds in a specific ward type (GENERAL, ICU, MATERNITY, etc.)
 *     tags:
 *       - Admissions & Ward Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: wardType
 *         schema:
 *           type: string
 *           enum: [GENERAL, ICU, MATERNITY, PEDIATRIC, SURGICAL]
 *         required: true
 *         description: Type of ward
 *     responses:
 *       200:
 *         description: Available beds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid ward type
 *       401:
 *         description: Unauthorized
 */
router.get("/available-beds", admissionWardController.getAvailableBeds);

/**
 * @swagger
 * /api/v1/admissions/admissions/create:
 *   post:
 *     summary: Create a ward admission
 *     description: Admit a patient to a ward and assign a bed
 *     tags:
 *       - Admissions & Ward Management
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
 *               - wardId
 *               - doctorId
 *               - bedId
 *               - admissionType
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               wardId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439020
 *               doctorId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               bedId:
 *                 type: string
 *                 example: BED-ICU-001
 *               admissionType:
 *                 type: string
 *                 enum: [EMERGENCY, PLANNED, TRANSFER]
 *               medicalHistory:
 *                 type: string
 *                 description: Patient's relevant medical history
 *     responses:
 *       201:
 *         description: Patient admission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or bed not available
 *       401:
 *         description: Unauthorized
 */
router.post("/admissions/create", admissionWardController.createWardAdmission);

/**
 * @swagger
 * /api/v1/admissions/admissions/{admissionId}/vitals:
 *   put:
 *     summary: Update patient vitals
 *     description: Record or update vital signs for an admitted patient
 *     tags:
 *       - Admissions & Ward Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - temperature
 *               - bloodPressure
 *               - heartRate
 *               - respiratoryRate
 *               - oxygenSaturation
 *             properties:
 *               temperature:
 *                 type: number
 *                 example: 36.5
 *                 description: Temperature in Celsius
 *               bloodPressure:
 *                 type: string
 *                 example: "120/80"
 *               heartRate:
 *                 type: number
 *                 example: 72
 *                 description: Heart rate in beats per minute
 *               respiratoryRate:
 *                 type: number
 *                 example: 16
 *                 description: Respiratory rate in breaths per minute
 *               oxygenSaturation:
 *                 type: number
 *                 example: 98
 *                 description: SpO2 percentage
 *               notes:
 *                 type: string
 *                 description: Additional notes from nurse
 *     responses:
 *       200:
 *         description: Vital signs updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Admission not found
 *       401:
 *         description: Unauthorized
 */
router.put("/admissions/:admissionId/vitals", admissionWardController.updatePatientVitals);

/**
 * @swagger
 * /api/v1/admissions/admissions/{admissionId}/discharge:
 *   put:
 *     summary: Discharge a patient
 *     description: Record patient discharge and end hospital admission
 *     tags:
 *       - Admissions & Ward Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dischargeSummary
 *               - dischargeDate
 *             properties:
 *               dischargeSummary:
 *                 type: string
 *                 example: Patient recovered well. Continue medications at home.
 *               dischargeDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-10
 *               followUpNotes:
 *                 type: string
 *                 description: Follow-up instructions for patient
 *     responses:
 *       200:
 *         description: Patient discharged successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Admission not found
 *       400:
 *         description: Patient already discharged
 *       401:
 *         description: Unauthorized
 */
router.put("/admissions/:admissionId/discharge", admissionWardController.dischargePatient);

export default router;