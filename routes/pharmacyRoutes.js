import express from "express";
import * as pharmacyController from "../controllers/pharmacyController.js";

const router = express.Router();

// ==================== PRESCRIPTIONS ====================

/**
 * @swagger
 * /api/v1/pharmacy/prescriptions:
 *   post:
 *     summary: Input prescription data
 *     description: Create a new prescription record in the system
 *     tags:
 *       - Pharmacy - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultationId
 *               - drugs
 *             properties:
 *               consultationId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               drugs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     drugId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     dosage:
 *                       type: string
 *                       example: "500mg"
 *                     frequency:
 *                       type: string
 *                       example: "3 times daily"
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/prescriptions", pharmacyController.inputPrescriptionData);

/**
 * @swagger
 * /api/v1/pharmacy/prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     description: Retrieve prescription details
 *     tags:
 *       - Pharmacy - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Prescription not found
 *   put:
 *     summary: Update prescription payment status
 *     description: Mark prescription as paid/unpaid
 *     tags:
 *       - Pharmacy - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Prescription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [PAID, UNPAID, PENDING]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Prescription not found
 */
router.get("/prescriptions/:id", pharmacyController.getPrescriptionById);
router.put("/prescriptions/:id", pharmacyController.updatePrescriptionPaymentStatus);

// ==================== DRUGS INVENTORY ====================

/**
 * @swagger
 * /api/v1/pharmacy/drugs:
 *   post:
 *     summary: Add drug to inventory
 *     description: Add a new drug or medication to the pharmacy inventory
 *     tags:
 *       - Pharmacy - Drugs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - drugName
 *               - dosage
 *               - quantity
 *               - unitPrice
 *               - expiryDate
 *             properties:
 *               drugName:
 *                 type: string
 *                 example: Paracetamol
 *               dosage:
 *                 type: string
 *                 example: "500mg"
 *               quantity:
 *                 type: number
 *                 example: 100
 *               unitPrice:
 *                 type: number
 *                 example: 25.50
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-12-31
 *     responses:
 *       201:
 *         description: Drug added to inventory successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 */
router.post("/drugs", pharmacyController.addDrugToInventory);

/**
 * @swagger
 * /api/v1/pharmacy/drugs/{drugId}/stock:
 *   put:
 *     summary: Update inventory stock level
 *     description: Update the stock quantity for a specific drug
 *     tags:
 *       - Pharmacy - Drugs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugId
 *         schema:
 *           type: string
 *         required: true
 *         description: Drug ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock level updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Drug not found
 */
router.put("/drugs/:drugId/stock", pharmacyController.updateInventoryStockLevel);

// ==================== RESTOCK REQUESTS ====================

/**
 * @swagger
 * /api/v1/pharmacy/restock-requests:
 *   post:
 *     summary: Request drug restock
 *     description: Create a restock request for drugs running low
 *     tags:
 *       - Pharmacy - Restock
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - drugId
 *               - quantity
 *               - priority
 *             properties:
 *               drugId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *     responses:
 *       201:
 *         description: Restock request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 */
router.post("/restock-requests", pharmacyController.requestRestock);

export default router;
