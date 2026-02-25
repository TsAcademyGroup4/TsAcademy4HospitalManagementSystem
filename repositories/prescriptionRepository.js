import Prescription from "../db/models/Prescription.model.js";

class PrescriptionRepository {
  // Create a prescription
    async create(payload) {
        const prescription = new Prescription(payload);
        return await prescription.save();
    }

    // Find by ID or throw error
    async findByIdOrThrow(id) {
        const prescription = await Prescription.findById(id)
        .populate("patientId", "firstName lastName patientId")
        .populate("enteredBy", "firstName lastName role")
        .populate("dispensedBy", "firstName lastName role")
        .populate("items.drugId", "name price stock");

        if (!prescription) {
        throw new Error("Prescription not found");
        }

        return prescription;
    }

    // Get all prescriptions
    async findAll() {
        return await Prescription.find()
        .populate("patientId", "firstName lastName patientId")
        .populate("enteredBy", "firstName lastName role")
        .populate("dispensedBy", "firstName lastName role")
        .populate("items.drugId", "name price stock")
        .sort({ createdAt: -1 });
    }

    // Get pending prescriptions (PAID but PENDING)
    async getPending() {
        return await Prescription.getPending(); // uses static method in model
    }

    // Get unpaid prescriptions
    async getUnpaid() {
        return await Prescription.getUnpaid(); // uses static method in model
    }

    // Save an updated prescription
    async save(prescription) {
        return await prescription.save();
    }
}

export default new PrescriptionRepository();