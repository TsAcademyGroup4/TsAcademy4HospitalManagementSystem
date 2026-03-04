import * as consultationService from "../services/consultationService.js";
import {StatusCodes} from "http-status-codes";

export const recordConsultation = async (req, res) => {
    try {
        const consultation = await consultationService.recordConsultation(req.body);
        return res.status(StatusCodes.CREATED).json({
            message: "Consultation created successfully",
            success: true,
            data: consultation,
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllConsultations = async (req, res) => {
    try {
        const consultations = await consultationService.getAllConsultations();
        return res.status(StatusCodes.OK).json({
            message: "Consultations retrieved successfully",
            success: true,
            data: consultations,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const getConsultationById = async (req, res) => {
    try {
        const consultation = await consultationService.getConsultationById(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: "Consultation retrieved successfully",
            success: true,
            data: consultation,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateConsultationById = async (req, res) => {
    try {
        const updated = await consultationService.updateConsultationById(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({
            message: "Consultation updated successfully",
            success: true,
            data: updated,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeConsultationById = async (req, res) => {
    try {
        await consultationService.deleteConsultationById(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: "Consultation deleted successfully",
            success: true,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: error.message,
        });
    }
};