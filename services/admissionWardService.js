import * as admissionRepository from "../repositories/admissionRepository.js";
import * as wardRepository from "../repositories/wardRepository.js";
import * as vitalSignsRepository from "../repositories/vitalSignsRepository.js";

export const getAvailableBeds = async (wardType) => {
  if (!wardType) throw new Error("Ward type is required");
  const availableBeds = await wardRepository.getAvailableBeds(wardType.toUpperCase());
  return availableBeds;
};

export const createWardAdmission = async ({ patientId, wardId, doctorId, bedId, admissionType }) => {
  if (!patientId || !wardId || !doctorId || !bedId) throw new Error("Patient ID, Ward ID, Doctor ID, and Bed ID are required");
  // Check if bed is available (fetch directly by ID)
  const bed = await wardRepository.getBedById(bedId);
  if (!bed) {
    throw new Error("Bed not found");
  }
  if (bed.wardId.toString() !== wardId) {
    throw new Error("Bed does not belong to specified ward");
  }
  if (bed.status !== 'AVAILABLE') {
    throw new Error("Selected bed is not available");
  }

  // Create admission
  const admissionData = {
    patientId,
    wardId,
    doctorId,
    bedId,
    admissionType: admissionType || 'GENERAL',
    status: 'ACTIVE'
  };

  const newAdmission = await admissionRepository.createAdmission(admissionData);
  // Update bed status to occupied
  await wardRepository.updateBedStatus(bedId, 'OCCUPIED');
  return newAdmission;
};

export const updatePatientVitals = async (admissionId, requestBody) => {
  if (!admissionId) {
    throw new Error("Admission ID is required");
  }

  // Verify admission exists and is active
  const admission = await admissionRepository.findAdmissionById(admissionId);
  if (!admission) {
    throw new Error("Admission not found");
  }
  if (admission.status !== 'ACTIVE') {
    throw new Error("Cannot update vitals for inactive admission");
  }

  // Update vital signs
  const updatedVitals = await vitalSignsRepository.updateVitalSigns(admissionId, requestBody);
  return updatedVitals;
};

export const dischargePatient = async (admissionId, dischargeSummary, dischargeDate, userId) => {
  if (!admissionId || !dischargeSummary || !dischargeDate) {
    throw new Error("Admission ID, discharge summary, and date are required");
  }

  // Verify admission exists and is active
  const admission = await admissionRepository.findAdmissionById(admissionId);
  if (!admission) {
    throw new Error("Admission not found");
  }
  if (admission.status !== 'ACTIVE') {
    throw new Error("Patient is not currently admitted");
  }

  // Discharge the patient
  const dischargeData = {
    dischargeSummary,
    dischargeDate: new Date(dischargeDate),
    dischargedBy: userId
  };

  const dischargedAdmission = await admissionRepository.dischargeAdmission(admissionId, dischargeData);
  // Update bed status back to available
  await wardRepository.updateBedStatus(admission.bedId, 'AVAILABLE');
  return dischargedAdmission;
};;