import express from "express";
import * as pharmacyController from "../controllers/pharmacyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// Prescriptions
router.post(
    "/prescriptions", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY","DOCTOR"]),
    pharmacyController.inputPrescriptionData
);
router.get("/prescriptions/:id", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY","DOCTOR"]),
    pharmacyController.getPrescriptionById
);
router.put("/prescriptions/:id", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY","DOCTOR"]),
    pharmacyController.updatePrescriptionPaymentStatus
);

// Drugs inventory
router.post("/drugs", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY"]),
    pharmacyController.addDrugToInventory
);
router.put("/drugs/:drugId/stock", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY"]),
    pharmacyController.updateInventoryStockLevel
);

// Restock
router.post("/restock-requests", 
    authMiddleware,
    authorizeRoles(["ADMIN", "PHARMACY"]),
    pharmacyController.requestRestock
);

export default router;
