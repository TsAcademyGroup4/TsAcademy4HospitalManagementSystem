import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: Create an appointment between a patient and doctor
 *     tags:
 *       - Appointments
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
 *               - appointmentDate
 *               - startTime
 *               - endTime
 *               - reason
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               doctorId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-15
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "11:00"
 *               reason:
 *                 type: string
 *                 example: Regular checkup
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or time slot not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post("/", appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/doctor/{doctorId}:
 *   get:
 *     summary: Get appointments for a doctor
 *     description: Retrieve all appointments scheduled for a specific doctor
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor's ID
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);

/**
 * @swagger
 * /api/v1/appointments/{appointmentId}:
 *   put:
 *     summary: Update an appointment
 *     description: Modify appointment details (date, time, reason)
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Cancel an appointment
 *     description: Cancel an existing appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:appointmentId", appointmentController.updateAppointment);

router.delete("/:appointmentId", appointmentController.cancelAppointment);

export default router;
