import { StatusCodes } from "http-status-codes";
import * as appointmentService from "../services/appointmentService.js";
import mongoose from "mongoose";

export const createAppointment = async (req, res) => {
  try {
    // collect and validate required fields
    const {
      patientId,
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      reason,
      type,
      departmentId,
    } = req.body;

    if (
      !patientId ||
      !doctorId ||
      !appointmentDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "patientId, doctorId, appointmentDate, startTime and endTime are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid doctor ID" });
    }

    if (endTime <= startTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "endTime must be after startTime" });
    }

    const appointment = await appointmentService.createAppointment({
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      reason,
      type,
      departmentId,
    });

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
    const { appointmentId } = req.params;
    // basic id validation
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid appointment ID" });
    }

    const updated = await appointmentService.updateAppointment(
      appointmentId,
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