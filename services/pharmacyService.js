import prescriptionRepository from "../repositories/prescriptionRepository.js";
import drugRepository from "../repositories/drugRepository.js";
//import consultationRepository from "../repositories/consultationRepository.js";
import restockRequestRepository from "../repositories/restockRequestRepository.js";

class PharmacyService {
  // ---- PRESCRIPTIONS ----
  async createPrescription({ patientId, consultationId, items, enteredBy }) {
    const consultation = await consultationRepository.findById(consultationId);
    if (!consultation) throw new Error("Consultation not found");

    const processedItems = [];
    for (const item of items) {
      const drug = await drugRepository.findById(item.drugId);
      if (!drug) throw new Error(`Drug not found: ${item.drugId}`);
      if (drug.stockQuantity < item.quantity)
        throw new Error(`Insufficient stock for ${drug.name}`);

      processedItems.push({
        drugId: drug._id,
        quantity: item.quantity,
        dosage: item.dosage,
        unitPrice: drug.unitPrice,
        totalPrice: drug.unitPrice * item.quantity,
      });
    }

    return await prescriptionRepository.create({
      patientId,
      consultationId,
      enteredBy,
      items: processedItems,
      paymentStatus: "AWAITING_PAYMENT",
    });
  }

  async getPrescriptionById(id) {
    return await prescriptionRepository.findByIdOrThrow(id);
  }

  async updatePayment(id, amount) {
    const prescription = await prescriptionRepository.findByIdOrThrow(id);
    return await prescription.markPaid(amount);
  }

  // ---- DRUGS ----
  async addDrug(payload) {
    if (payload.reorderLevel > payload.stockQuantity)
      payload.reorderLevel = payload.stockQuantity;
    return await drugRepository.create(payload);
  }

  async updateDrugStock(drugId, quantity) {
    const drug = await drugRepository.findById(drugId);
    if (!drug) throw new Error("Drug not found");

    if (quantity >= 0) return await DrugRepository.addStock(drugId, quantity);
    else return await drugRepository.deductStock(drugId, Math.abs(quantity));
  }

  // ---- RESTOCK REQUESTS ----
  async createRestockRequest({ drugId, requestedBy, quantity, notes }) {
    return await restockRequestRepository.create({
      drugId,
      requestedBy,
      quantity,
      notes,
      status: "PENDING",
    });
  }

  async approveRestock(requestId, approvedBy) {
    const request = await restockRequestRepository.findById(requestId);
    return await restockRequestRepository.approve(request, approvedBy);
  }

  async rejectRestock(requestId, approvedBy, reason) {
    const request = await restockRequestRepository.findById(requestId);
    return await restockRequestRepository.reject(request, approvedBy, reason);
  }

  async fulfillRestock(requestId, quantity) {
    const request = await RestockRequestRepository.findById(requestId);
    return await restockRequestRepository.fulfill(request, quantity);
  }
}

export default new PharmacyService();