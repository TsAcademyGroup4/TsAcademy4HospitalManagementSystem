import consultationRepository from "../repositories/consultationRepository.js";

class consultationService{
    async createConsultation(payload){
        if(!payload.patientId || !payload.doctorId || !payload.symptoms){
            throw new Error("Patient ID, Doctor ID and Symptoms are required");
        }

        return await consultationRepository.create(payload);
    }

    async getAllConsultations(){
        return await consultationRepository.findAll();
    }

    async getConsultationById(id){
        const consultation = await consultationRepository.findById(id);
        
        if(!consultation){
            throw new Error("Consultation not found");
        }

        return consultation;
    }

    async updateConsultation(id, payload){
        const updated = await consultationRepository.update(id, payload);
        
        if(!updated){
            throw new Error("Consultation not found or update failed");
        }
        return updated;
    }

    async deleteConsultation(id){
        const deleted = await consultationRepository.delete(id);
        
        if(!deleted){
            throw new Error("Consultation not found or delete failed");
        }
        return deleted;
    }

};

export default new consultationService();