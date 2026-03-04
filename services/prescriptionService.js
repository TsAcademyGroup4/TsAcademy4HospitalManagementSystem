import prescriptionRepository from "../repositories/prescriptionRepository.js";

export const createPrescription = async (data, userId) => {
  if (!data.items || !data.items.length) {
    throw new Error("Prescription must contain at least one item");
  }

  // Attach the creator
  data.enteredBy = userId;

  // Additional validation can go here, e.g., check stock availability if needed
  // for each item: await checkStock(item.drugId, item.quantity);

  return await prescriptionRepository.create(data);
};

export const getById = async (id) => {
  return await prescriptionRepository.findByIdOrThrow(id);
};

export const getAll = async () => {
  return await prescriptionRepository.findAll();
};

export const markPaid = async (id, amount) => {
  if (amount <= 0) throw new Error("Payment amount must be greater than 0");

  const prescription = await prescriptionRepository.findByIdOrThrow(id);
  return await prescription.markPaid(amount);
};

export const dispense = async (id, userId) => {
  const prescription = await prescriptionRepository.findByIdOrThrow(id);

  if (prescription.status === "DISPENSED") {
    throw new Error("Prescription already dispensed");
  }

  // dispense method in the model handles stock deduction & validation
  return await prescription.dispense(userId);
};

export const getPending = async () => {
  return await prescriptionRepository.getPending();
};

export const getUnpaid = async () => {
  return await prescriptionRepository.getUnpaid();
};

export const cancel = async (id) => {
  const prescription = await prescriptionRepository.findByIdOrThrow(id);

  if (prescription.status === "DISPENSED") {
    throw new Error("Cannot cancel a dispensed prescription");
  }

  prescription.status = "CANCELLED";
  return await prescriptionRepository.save(prescription);
};