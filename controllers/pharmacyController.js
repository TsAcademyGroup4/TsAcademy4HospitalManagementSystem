import * as pharmacyService from "../services/pharmacyService.js";
import { StatusCodes } from "http-status-codes";

export const inputPrescriptionData = async (req,res) => {
  try {
    const {patientId, consultationId, items} = req.body;
    if (!patientId || !consultationId || !Array.isArray(items) || items.length === 0) {
      throw new Error("Prescription must have a patientId and at least one item");
    }
    const prescription = await pharmacyService.inputPrescriptionData({patientId, consultationId, items}, req.user?.id);
    res.status(StatusCodes.CREATED).json(prescription);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getPrescriptionById = async (req,res) => {
  try {
    const pres = await pharmacyService.getPrescriptionById(req.params.id);
    res.status(StatusCodes.OK).json(pres);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

export const updatePrescriptionPaymentStatus = async (req,res) => {
  try {
    const {status} = req.body;
    if(!status) throw new Error("Status field is required");
    const updated = await pharmacyService.updatePrescriptionPaymentStatus(req.params.id, { status });
    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const addDrugToInventory = async (req,res) => {
  try {
    const {name, stock, unitPrice} = req.body;
    if (!name || typeof stock !== "number" || typeof unitPrice !== "number") {
      throw new Error("Drug must have a name, stock (number) and unitPrice (number)");
    }
    const drug = await pharmacyService.addDrugToInventory({name, stock, unitPrice});
    res.status(StatusCodes.CREATED).json(drug);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateInventoryStockLevel = async (req,res) => {
  try {
    const { drugId } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== "number") throw new Error("Quantity must be a number");
    const updated = await pharmacyService.updateInventoryStockLevel(drugId, quantity);
    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const requestRestock = async (req,res) => {
  try {
    const {drugId, requestedQuantity, reason} = req.body;
    if (!drugId || !requestedQuantity || !reason) {
      throw new Error("drugId, requestedQuantity and reason are required");
    }
    const request = await pharmacyService.requestRestock({
      drugId,
      requestedQuantity,
      reason,
      requestedBy: req.user?.id,
    });
    res.status(StatusCodes.CREATED).json(request);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};