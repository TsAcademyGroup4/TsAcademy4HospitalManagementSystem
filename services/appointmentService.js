import appointmentRepository from "../repositories/appointment.repository.js";

class AppointmentService {
  async createAppointment(data) {
    return await appointmentRepository.create(data);
  }

  async getDoctorAppointments(doctorId, date) {
    return await appointmentRepository.getDoctorAppointments(doctorId, date);
  }

  async updateAppointment(id, data) {
    const updated = await appointmentRepository.update(id, data);
    if (!updated) throw new Error("Appointment not found");
    return updated;
  }

  async cancelAppointment(id, reason, cancelledBy) {
    const cancelled = await appointmentRepository.cancel(
      id,
      reason,
      cancelledBy,
    );

    if (!cancelled) throw new Error("Appointment not found");
    return cancelled;
  }
}

export default new AppointmentService();
