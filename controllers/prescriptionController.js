import { StatusCodes, ReasonPhrases } from "http-status-codes";
import * as prescriptionService from "../services/prescriptionService.js";

export const createPrescription = async (req, res) => {
    try {
        const prescription = await prescriptionService.createPrescription(
            req.body,
            req.user.id // authMiddleware guarantees req.user exists
        );
        res.status(StatusCodes.CREATED).json(prescription);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

export const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await prescriptionService.getById(req.params.id);
        res.status(StatusCodes.OK).json(prescription);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
};

export const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prescriptionService.getAll();
        res.status(StatusCodes.OK).json(prescriptions);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const markPrescriptionAsPaid = async (req, res) => {
    try {
        const result = await prescriptionService.markPaid(
            req.params.id,
            req.body.amount
        );
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

export const dispensePrescription = async (req, res) => {
    try {
        const result = await prescriptionService.dispense(
            req.params.id,
            req.user.id
        );
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

export const getPendingPrescriptions = async (req, res) => {
    try {
        const result = await prescriptionService.getPending();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const getUnpaid = async (req, res) => {
    try {
        const result = await prescriptionService.getUnpaid();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const cancelPrescription = async (req, res) => {
    try {
        const result = await prescriptionService.cancel(req.params.id);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};