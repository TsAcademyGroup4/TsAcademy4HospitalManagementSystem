import { StatusCodes, ReasonPhrases } from "http-status-codes";
import prescriptionService from "../services/prescriptionService.js";

class PrescriptionController {
    async create(req, res) {
        try {
        const prescription = await prescriptionService.createPrescription(
            req.body,
            req.user.id // authMiddleware guarantees req.user exists
        );
            res.status(StatusCodes.CREATED).json(prescription);
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }

  async getById(req, res) {
    try {
      const prescription = await prescriptionService.getById(req.params.id);
      res.status(StatusCodes.OK).json(prescription);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const prescriptions = await prescriptionService.getAll();
      res.status(StatusCodes.OK).json(prescriptions);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async markPaid(req, res) {
    try {
      const result = await prescriptionService.markPaid(
        req.params.id,
        req.body.amount
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async dispense(req, res) {
    try {
      const result = await prescriptionService.dispense(
        req.params.id,
        req.user.id
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getPending(req, res) {
    try {
      const result = await prescriptionService.getPending();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async getUnpaid(req, res) {
    try {
      const result = await prescriptionService.getUnpaid();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async cancel(req, res) {
    try {
      const result = await prescriptionService.cancel(req.params.id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}

export default new PrescriptionController();