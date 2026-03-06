import Appointment from "../db/models/appointment.model.js";

class AppointmentRepository {
  async create(data, session) {
    const [appointment] = await Appointment.create([data], { session });
    return appointment;
  }

  async findById(id) {
    return await Appointment.findById(id);
  }

  async update(id, data) {
    return await Appointment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async cancel(id, reason, cancelledBy) {
    const appointment = await Appointment.findById(id);
    if (!appointment) return null;
    return await appointment.cancel(reason, cancelledBy);
  }

  // NEW: Complete appointment using model method
  async complete(id) {
    const appointment = await Appointment.findById(id);
    if (!appointment) return null;
    return await appointment.complete();
  }

  // NEW: Mark no-show using model method
  async markNoShow(id) {
    const appointment = await Appointment.findById(id);
    if (!appointment) return null;
    return await appointment.markNoShow();
  }

  async getDoctorAppointments(doctorId, date) {
    return await Appointment.getDoctorAppointments(doctorId, date);
  }

  // NEW: Get patient appointments
  async getPatientAppointments(patientId) {
    return await Appointment.find({ 
      patientId,
      status: { $nin: ["CANCELLED"] }
    })
    .populate("doctorId", "firstName lastName specialization")
    .populate("departmentId", "name")
    .sort({ appointmentDate: -1, timeSlot: -1 });
  }
}

export default new AppointmentRepository();