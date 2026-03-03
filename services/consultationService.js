import consultationRepository from "../repositories/consultationRepository.js";

export const recordConsultation = async (payload) => {
    if(!payload.patientId || !payload.doctorId || !payload.symptoms){
        throw new Error("Patient ID, Doctor ID and Symptoms are required");
    }

    return await consultationRepository.create(payload);
};

export const getAllConsultations = async () => {
    return await consultationRepository.findAll();
};

export const getConsultationById = async (id) => {
    const consultation = await consultationRepository.findById(id);
    if(!consultation){
        throw new Error("Consultation not found");
    }
    return consultation;
};

export const updateConsultationById = async (id, payload) => {
    const updated = await consultationRepository.update(id, payload);
    if(!updated){
        throw new Error("Consultation not found or update failed");
    }
    return updated;
};

export const deleteConsultationById = async (id) => {
    const deleted = await consultationRepository.delete(id);
    if(!deleted){
        throw new Error("Consultation not found or delete failed");
    }
    return deleted;
};