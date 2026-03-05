import Drug from "../db/models/Drug.model.js";
import Prescription from "../db/models/Prescription.model.js";
import RestockRequest from "../db/models/RestockRequest.model.js";

// Prescription operations
export const inputPrescriptionData = async (data, userId) => {
  // calculate totalPrice for items and totalAmount handled by schema pre-save
  data.enteredBy = userId;
  const prescription = new Prescription(data);
  await prescription.save();
  return prescription;
};

export const getPrescriptionById = async (id) => {
  const pres = await Prescription.findById(id).populate("items.drugId");
  if (!pres) throw new Error("Prescription not found");
  return pres;
};

export const updatePrescriptionPaymentStatus = async (id, updateData) => {
  const pres = await Prescription.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!pres) throw new Error("Prescription not found");
  return pres;
};

// Drug inventory operations
export const addDrugToInventory = async (drugData) => {
  const mappedData = {
    name: drugData.name,
    stockQuantity: drugData.stock,
    unitPrice: drugData.unitPrice
  };
  const drug = new Drug(mappedData);
  await drug.save();
  return drug;
};

export const updateInventoryStockLevel = async (drugId, quantity) => {
  const drug = await Drug.findById(drugId);
  if (!drug) throw new Error("Drug not found");

  // quantity may be positive (add) or negative (deduct)
  if (quantity >= 0) {
    return await drug.addStock(quantity);
  } else {
    return await drug.deductStock(Math.abs(quantity));
  }
};

// Restock request
export const requestRestock = async (requestData) => {
  // expected fields: drugId, requestedQuantity, reason, requestedBy
  if (!requestData.drugId || !requestData.requestedQuantity || !requestData.reason || !requestData.requestedBy) {
    throw new Error("drugId, requestedQuantity, reason and requestedBy are required");
  }

  const req = new RestockRequest(requestData);
  await req.save();
  return req;
};