import mongoose from "mongoose";
import appointmentRepository from "../repositories/appointment.repository.js";
import Appointment from "../db/models/appointment.model.js";

const WORKING_HOURS = [
  "09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30",
  "13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30"
];

export const createAppointment = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { doctorId, appointmentDate, timeSlot } = data;

    // Doctor schedule validation
    if (!WORKING_HOURS.includes(timeSlot)) {
      throw new Error("Selected time slot is outside doctor's working hours");
    }

    // Prevent double booking
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
      status: { $nin: ["CANCELLED", "NO_SHOW"] }
    }).session(session);

    if (existing) {
      throw new Error("Doctor already booked at this time");
    }

    const appointment = await appointmentRepository.create(data, session);

    await session.commitTransaction();
    session.endSession();

    return appointment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getDoctorAppointments = async (doctorId, date) => {
  return appointmentRepository.getDoctorAppointments(doctorId, date);
};

// NEW: Get patient appointments
export const getPatientAppointments = async (patientId) => {
  return appointmentRepository.getPatientAppointments(patientId);
};

// NEW: Get available slots
export const getAvailableSlots = async (doctorId, date) => {
  return Appointment.getAvailableSlots(doctorId, date, WORKING_HOURS);
};

// NEW: Complete appointment
export const completeAppointment = async (id) => {
  const appointment = await appointmentRepository.findById(id);
  
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  
  if (appointment.status === "COMPLETED") {
    throw new Error("Appointment already completed");
  }
  
  if (appointment.status === "CANCELLED") {
    throw new Error("Cannot complete a cancelled appointment");
  }
  
  return appointmentRepository.complete(id);
};

// NEW: Mark as no-show
export const markNoShow = async (id) => {
  const appointment = await appointmentRepository.findById(id);
  
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  
  if (appointment.status === "NO_SHOW") {
    throw new Error("Appointment already marked as no-show");
  }
  
  if (appointment.status === "COMPLETED") {
    throw new Error("Cannot mark completed appointment as no-show");
  }
  
  return appointmentRepository.markNoShow(id);
};

export const updateAppointment = async (id, data) => {
  const appointment = await appointmentRepository.findById(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "COMPLETED") {
    throw new Error("Completed appointments cannot be modified");
  }

  return appointmentRepository.update(id, data);
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