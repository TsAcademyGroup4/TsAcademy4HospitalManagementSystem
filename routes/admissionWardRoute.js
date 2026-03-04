import express from "express";
import * as admissionWardController from "../controllers/admissionWardController.js";

const router = express.Router();

/**
 * GET /admissions/available-beds
 * Get available beds by ward type
 * Query Parameters: ?wardType=<wardType> (e.g., GENERAL, ICU, MATERNITY)
 */
router.get("/available-beds", admissionWardController.getAvailableBeds);

/**
 * POST /admissions/create
 * Create a new ward admission
 * Body: { patientId, wardId, doctorId, bedId, admissionType }
 */
router.post("/admissions/create", admissionWardController.createWardAdmission);

/**
 * PUT /admissions/:admissionId/vitals
 * Update patient vitals for an admission
 * URL Parameters: admissionId
 * Body: { temperature, bloodPressure, heartRate, respiratoryRate, oxygenSaturation, notes }
 */
router.put("/admissions/:admissionId/vitals", admissionWardController.updatePatientVitals);

/**
 * PUT /admissions/:admissionId/discharge
 * Discharge a patient
 * URL Parameters: admissionId
 * Body: { dischargeSummary, dischargeDate }
 */
router.put("/admissions/:admissionId/discharge", admissionWardController.dischargePatient);

export default router;