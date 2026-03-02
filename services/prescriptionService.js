import prescriptionRepository from "../repositories/prescriptionRepository.js";

class PrescriptionService {
  // Create a new prescription
  async createPrescription(data, userId) {
    if (!data.items || !data.items.length) {
      throw new Error("Prescription must contain at least one item");
    }

    // Attach the creator
    data.enteredBy = userId;

    // Additional validation can go here, e.g., check stock availability if needed
    // for each item: await checkStock(item.drugId, item.quantity);

    return await prescriptionRepository.create(data);
  }

  // Get a prescription by ID
  async getById(id) {
    return await prescriptionRepository.findByIdOrThrow(id);
  }

  // Get all prescriptions
  async getAll() {
    return await prescriptionRepository.findAll();
  }

  // Mark a prescription as paid (partial or full)
  async markPaid(id, amount) {
    if (amount <= 0) throw new Error("Payment amount must be greater than 0");

    const prescription = await prescriptionRepository.findByIdOrThrow(id);
    return await prescription.markPaid(amount);
  }

  // Dispense a prescription
  async dispense(id, userId) {
    const prescription = await prescriptionRepository.findByIdOrThrow(id);

    if (prescription.status === "DISPENSED") {
      throw new Error("Prescription already dispensed");
    }

    // dispense method in the model handles stock deduction & validation
    return await prescription.dispense(userId);
  }

  // Get all pending prescriptions (paid but not yet dispensed)
  async getPending() {
    return await prescriptionRepository.getPending();
  }

  // Get all unpaid prescriptions
  async getUnpaid() {
    return await prescriptionRepository.getUnpaid();
  }

  // Cancel a prescription
  async cancel(id) {
    const prescription = await prescriptionRepository.findByIdOrThrow(id);

    if (prescription.status === "DISPENSED") {
      throw new Error("Cannot cancel a dispensed prescription");
    }

    prescription.status = "CANCELLED";
    return await prescriptionRepository.save(prescription);
  }
}

export default new PrescriptionService();