import appointmentRepository from "../repositories/appointment.repository.js";

// Create a new appointment
export const createAppointment = async (data) => {
  return await appointmentRepository.create(data);
};

// Get all appointments for a doctor on a given date
export const getDoctorAppointments = async (doctorId, date) => {
  return await appointmentRepository.getDoctorAppointments(doctorId, date);
};

// Update an existing appointment
export const updateAppointment = async (id, data) => {
  const updated = await appointmentRepository.update(id, data);
  if (!updated) throw new Error("Appointment not found");
  return updated;
};

// Cancel an appointment
export const cancelAppointment = async (id, reason, cancelledBy) => {
  const cancelled = await appointmentRepository.cancel(id, reason, cancelledBy);
  if (!cancelled) throw new Error("Appointment not found");
  return cancelled;
};