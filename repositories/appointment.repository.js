import Appointment from "../db/models/appointment.model.js";

class AppointmentRepository {
  async create(data) {
    return await Appointment.create(data);
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

  async getDoctorAppointments(doctorId, date) {
    return await Appointment.getDoctorAppointments(doctorId, date);
  }
}

export default new AppointmentRepository();
