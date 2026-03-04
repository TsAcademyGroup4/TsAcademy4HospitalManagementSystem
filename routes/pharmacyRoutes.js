import express from "express";
import PharmacyController from "../controllers/pharmacyController.js";

const router = express.Router();

// PRESCRIPTIONS
router.post("/pharmacy/prescriptions", PharmacyController.createPrescription);
router.get("/pharmacy/prescriptions/:prescriptionId", PharmacyController.getPrescription);
router.put("/pharmacy/prescriptions/:prescriptionId/payment", PharmacyController.updatePayment);

// DRUGS
router.post("/pharmacy/drugs", PharmacyController.addDrug);
router.put("/pharmacy/drugs/:drugId/stock", PharmacyController.updateDrugStock);

// RESTOCK
router.post("/pharmacy/restock-requests", PharmacyController.createRestockRequest);

export default router;