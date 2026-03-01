import * as patientRepository from "../repositories/patientRepository"

export const registerPatient = async ({ firstName, lastName, dob, gender, phone, address }) => {
  const { firstName, lastName, dob, gender, phone, address } = data; 
  // Check if patient already exists by phone number
  const existingPatient = await patientRepository.findPatientByPhone(phone);
  if (existingPatient) {
    throw new Error("Patient with this phone number already exists");
  }  
  // Create new patient record
  const patientData = {
    firstName,
    lastName,
    dateOfBirth: dob,
    gender: gender.toUpperCase(),
    phone,
    address
  };  
  const newPatient = await patientRepository.createPatient(patientData);
  return newPatient;
}

export const getPatientById = async(patientId) => {
  const patient = await patientRepository.findPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
}

export const searchPatientByNameAndPhoneNumber = async({phone, name}) => {
  const patients = await patientRepository.findPatientByPhoneAndName(phone, name);
  return patients;
}