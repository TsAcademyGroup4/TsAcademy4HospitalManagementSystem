import consultation from '../db/models/Consultation.model.js';

//Create a new consultation
class ConsultationRepository {
    async create(data) {
        return await Consultation.create(data);
    }

    //Find consultations with filters and pagination
    async findAll(){
        return await Consultation.find()
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ createdAt: -1 });
    }

    //Find a consultation by ID
    async findById(id) {
        return await Consultation.findById(id)
            .populate('patientId', 'name')
            .populate('doctorId', 'name');
    }

    //Update a consultation by ID
    async update(id, data) {
        return await Consultation.findByIdAndUpdate(id, data, { new: true });
    }

    //Delete a consultation by ID
    async delete(id) {
        return await Consultation.findByIdAndDelete(id);
    }
};

export default new ConsultationRepository();
