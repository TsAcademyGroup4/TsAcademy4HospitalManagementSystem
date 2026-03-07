import appointmentRepository from "../repositories/appointment.repository.js";

// helper to convert HH:MM into minutes
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Create a new appointment
export const createAppointment = async (data) => {
  const { doctorId, appointmentDate, startTime, endTime } = data;

  // perform overlap check at service level
  const dateObj = new Date(appointmentDate);
  const existing = await getDoctorAppointments(doctorId, dateObj);

  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);

  for (const apt of existing) {
    const s = toMinutes(apt.startTime);
    const e = toMinutes(apt.endTime);
    if (newStart < e && newEnd > s) {
      throw new Error("Requested slot overlaps with another appointment");
    }
  }
  return await appointmentRepository.create(data);
};

// Get all appointments for a doctor on a given date
// This comes back sorted to make sure the algorithm in the controller works correctly
export const getDoctorAppointments = async (doctorId, date) => {
  return appointmentRepository.getDoctorAppointments(doctorId, date);
};


export const updateAppointment = async (id, data) => {
  // if any scheduling fields are present, run overlap check
  const { doctorId, appointmentDate, startTime, endTime } = data;
  if (doctorId || appointmentDate || startTime || endTime) {
    // fetch the target appointment to know original values
    const existingApt = await appointmentRepository.findById(id);
    if (!existingApt) throw new Error("Appointment not found");

    const doctor = doctorId || existingApt.doctorId.toString();
    const dateObj = appointmentDate ? new Date(appointmentDate) : existingApt.appointmentDate;
    const currStart = startTime || existingApt.startTime;
    const currEnd = endTime || existingApt.endTime;

    const appts = await getDoctorAppointments(doctor, dateObj);
    const newStart = toMinutes(currStart);
    const newEnd = toMinutes(currEnd);
    if (newEnd <= newStart) {
      throw new Error("endTime must be after startTime");
    }

    for (const apt of appts) {
      if (apt._id.toString() === id) continue;
      const s = toMinutes(apt.startTime);
      const e = toMinutes(apt.endTime);
      if (newStart < e && newEnd > s) {
        throw new Error("Updated slot overlaps with another appointment");
      }
    }
  }

  const updated = await appointmentRepository.update(id, data);
  if (!updated) throw new Error("Appointment not found");
  return updated;
};


export const cancelAppointment = async (id, reason, cancelledBy) => {

  const appointment = await appointmentRepository.findById(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "CANCELLED") {
    throw new Error("Appointment already cancelled");
  }

  return appointmentRepository.cancel(id, reason, cancelledBy);
};
