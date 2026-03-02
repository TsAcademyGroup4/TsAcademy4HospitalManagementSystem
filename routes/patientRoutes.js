import express from "express";
import patientController from "../controllers/patientController.js";

const router = express.Router();
/**
 * POST /patients/register
 * Register a new patient
 * Body: { firstName, lastName, dob, gender, phone, address }
 */
router.post("/register", patientController.registerPatient);

/**
 * GET /patients/search
 * Search patients by phone and name
 * Query Parameters: ?phone=<phoneNumber>&name=<patientName>
 */
router.get("/search", patientController.searchPatient);

/**
 * GET /patients/:id
 * Get patient by ID
 * URL Parameters: id (patient ID or custom patientId like PAT-00001)
 */
router.get("/:id", patientController.getPatientById);

export default router;
