import express from "express";
import * as pharmacyController from "../controllers/pharmacyController.js";

const router = express.Router();

// Prescriptions
router.post("/prescriptions", pharmacyController.inputPrescriptionData);
router.get("/prescriptions/:id", pharmacyController.getPrescriptionById);
router.put("/prescriptions/:id", pharmacyController.updatePrescriptionPaymentStatus);

// Drugs inventory
router.post("/drugs", pharmacyController.addDrugToInventory);
router.put("/drugs/:drugId/stock", pharmacyController.updateInventoryStockLevel);

// Restock
router.post("/restock-requests", pharmacyController.requestRestock);

export default router;
