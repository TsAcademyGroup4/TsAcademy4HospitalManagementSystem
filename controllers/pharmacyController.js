// src/modules/pharmacy/controllers/pharmacy.controller.js
import PharmacyService from "../services/pharmacyService.js";

class PharmacyController {
  // ---- PRESCRIPTIONS ----
  async createPrescription(req, res) {
    try {
      const prescription = await PharmacyService.createPrescription(req.body);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPrescription(req, res) {
    try {
      const prescription = await PharmacyService.getPrescriptionById(
        req.params.prescriptionId
      );
      res.json(prescription);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updatePayment(req, res) {
    try {
      const updated = await PharmacyService.updatePayment(
        req.params.prescriptionId,
        req.body.amount
      );
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ---- DRUGS ----
  async addDrug(req, res) {
    try {
      const drug = await PharmacyService.addDrug(req.body);
      res.status(201).json(drug);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateDrugStock(req, res) {
    try {
      const updated = await PharmacyService.updateDrugStock(
        req.params.drugId,
        req.body.quantity
      );
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ---- RESTOCK REQUESTS ----
  async createRestockRequest(req, res) {
    try {
      const request = await PharmacyService.createRestockRequest(req.body);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new PharmacyController();