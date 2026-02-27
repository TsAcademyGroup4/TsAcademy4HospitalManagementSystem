import appointmentService from "../services/appointment.service.js";
import mongoose from "mongoose";

class AppointmentController {
  async create(req, res) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return res.status(201).json(appointment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getDoctorAppointments(req, res) {
    try {
      const { doctorId } = req.params;
      const date = req.query.date || new Date();

      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ message: "Invalid doctor ID" });
      }

      const appointments = await appointmentService.getDoctorAppointments(
        doctorId,
        date,
      );

      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await appointmentService.updateAppointment(
        req.params.appointmentId,
        req.body,
      );

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async cancel(req, res) {
    try {
      const reason = req.body?.reason || "Cancelled by front desk";

      const cancelled = await appointmentService.cancelAppointment(
        req.params.appointmentId,
        reason,
        req.user?._id || null,
      );

      return res.status(200).json({
        message: "Appointment cancelled successfully",
        cancelled,
      });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export default new AppointmentController();
