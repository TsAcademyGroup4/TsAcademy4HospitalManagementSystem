import { StatusCodes } from "http-status-codes";
import * as appointmentService from "../services/appointmentService.js";
import mongoose from "mongoose";

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    return res.status(StatusCodes.CREATED).json(appointment);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const date = (req.query.date) ? new Date(req.query.date) : new Date();

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid doctor ID" });
    }

    const appointments = await appointmentService.getDoctorAppointments(
      doctorId,
      date
    );

    return res.status(StatusCodes.ACCEPTED).json(appointments);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updated = await appointmentService.updateAppointment(
      req.params.appointmentId,
      req.body
    );

    return res.status(StatusCodes.ACCEPTED).json(updated);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const reason = req.body?.reason || "Cancelled by front desk";

    const cancelled = await appointmentService.cancelAppointment(
      req.params.appointmentId,
      reason,
      req.user?._id || null
    );

    return res.status(StatusCodes.ACCEPTED).json({
      message: "Appointment cancelled successfully",
      cancelled,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};