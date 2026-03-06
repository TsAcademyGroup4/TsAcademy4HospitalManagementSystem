import { StatusCodes } from "http-status-codes";
import * as appointmentService from "../services/appointmentService.js";
import mongoose from "mongoose";

export const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      type,
      reasonForVisit,
      notes
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid patient or doctor ID"
      });
    }

    const appointment = await appointmentService.createAppointment({
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      type,
      reasonForVisit,
      notes,
      createdBy: req.user?._id || null
    });

    return res.status(StatusCodes.CREATED).json(appointment);

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message
    });
  }
};


export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid doctor ID"
      });
    }

    const date = req.query.date ? new Date(req.query.date) : new Date();

    const appointments = await appointmentService.getDoctorAppointments(
      doctorId,
      date
    );

    return res.status(StatusCodes.OK).json(appointments);

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message
    });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid appointment ID"
      });
    }

    const {
      appointmentDate,
      timeSlot,
      type,
      reasonForVisit,
      notes
    } = req.body;

    const updated = await appointmentService.updateAppointment(
      appointmentId,
      {
        appointmentDate,
        timeSlot,
        type,
        reasonForVisit,
        notes
      }
    );

    return res.status(StatusCodes.OK).json(updated);

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message
    });
  }
};


export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid appointment ID"
      });
    }

    const reason = req.body?.reason || "Cancelled by front desk";

    const cancelled = await appointmentService.cancelAppointment(
      appointmentId,
      reason,
      req.user?._id || null
    );

    return res.status(StatusCodes.OK).json({
      message: "Appointment cancelled successfully",
      cancelled
    });

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message
    });
  }
};
