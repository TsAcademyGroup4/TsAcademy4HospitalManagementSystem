import consultationService from "../services/consultationService.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

class consultationController {
    async create(req, res) {
        try{
            const consultation = await consultationService.createConsultation(req.body);
            
            return res.status(HTTP_STATUS.CREATED).json({
                message: "Consultation created successfully",
                success: true,
                data: consultation,
            });
        } catch(error){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getAll(req, res) {
    try{
        const consultations = await consultationService.getAllConsultations();

        return res.status(HTTP_STATUS.OK).json({
            message: "Consultations retrieved successfully",
            success: true,
            data: consultations,
        });
        } catch(error){
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getById(req, res) {
        try{
            const consultation = await consultationService.getConsultationById(req.params.id);

            return res.status(HTTP_STATUS.OK).json({
                message: "Consultation retrieved successfully",
                success: true,
                data: consultation,
            });
        } catch(error){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message,
            });
        }
    }

    async update(req, res) {
        try{
            const updated = await consultationService.updateConsultation(req.params.id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: "Consultation updated successfully",
                success: true,
                data: updated,
            });
        } catch(error){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message,
            });
        }
    }
    
    async delete(req, res) {
        try{
            await consultationService.deleteConsultation(req.params.id);

            return res.status(HTTP_STATUS.OK).json({
                message: "Consultation deleted successfully",
                success: true,
            });
        } catch(error){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new consultationController();

