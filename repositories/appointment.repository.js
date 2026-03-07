import Appointment from "../db/models/appointment.model.js";

class AppointmentRepository {
  async create(data) {
    // Check for time overlap
    const startDateTime = new Date(`${data.appointmentDate.toISOString().split('T')[0]}T${data.startTime}:00`);
    const endDateTime = new Date(`${data.appointmentDate.toISOString().split('T')[0]}T${data.endTime}:00`);

    const existing = await Appointment.findOne({
      doctorId: data.doctorId,
      appointmentDate: data.appointmentDate,
      status: { $ne: 'CANCELLED' },
      $or: [
        { $and: [{ startTime: { $lt: data.endTime } }, { endTime: { $gt: data.startTime } }] },
        { $and: [{ startTime: { $lte: data.startTime } }, { endTime: { $gte: data.endTime } }] },
        { $and: [{ startTime: { $gte: data.startTime } }, { endTime: { $lte: data.endTime } }] }
      ]
    });

    if (existing) {
      throw new Error('Time slot overlaps with an existing appointment for this doctor');
    }

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
