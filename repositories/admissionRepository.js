import Admission from "../db/models/Admission.model.js";

/**
 * Create a new ward admission
 * @param {Object} admissionData - Admission information
 * @returns {Object} - Created admission document
 */
export const createAdmission = async (admissionData) => {
  try {
    const newAdmission = new Admission(admissionData);
    await newAdmission.save();
    return newAdmission;
  } catch (error) {
    throw new Error(`Error creating admission: ${error.message}`);
  }
};

/**
 * Find admission by ID
 * @param {String} admissionId - Admission ID
 * @returns {Object} - Admission document or null
 */
export const findAdmissionById = async (admissionId) => {
  try {
    const admission = await Admission.findById(admissionId).populate('patientId wardId bedId doctorId');
    return admission;
  } catch (error) {
    throw new Error(`Error finding admission: ${error.message}`);
  }
};

/**
 * Update admission information
 * @param {String} admissionId - Admission ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated admission document
 */
export const updateAdmission = async (admissionId, updateData) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      admissionId,
      updateData,
      { new: true, runValidators: true }
    );
    return admission;
  } catch (error) {
    throw new Error(`Error updating admission: ${error.message}`);
  }
};

/**
 * Discharge a patient
 * @param {String} admissionId - Admission ID
 * @param {Object} dischargeData - Discharge summary and date
 * @returns {Object} - Updated admission document
 */
export const dischargeAdmission = async (admissionId, dischargeData) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      admissionId,
      {
        status: 'DISCHARGED',
        dischargeSummary: dischargeData.dischargeSummary,
        dischargeDate: dischargeData.dischargeDate,
        dischargedBy: dischargeData.dischargedBy
      },
      { new: true }
    );
    return admission;
  } catch (error) {
    throw new Error(`Error discharging patient: ${error.message}`);
  }
};

/**
 * Get all active admissions
 * @returns {Array} - Array of active admissions
 */
export const getActiveAdmissions = async () => {
  try {
    const admissions = await Admission.find({ status: 'ACTIVE' })
      .populate('patientId wardId bedId doctorId')
      .sort({ createdAt: -1 });
    return admissions;
  } catch (error) {
    throw new Error(`Error fetching active admissions: ${error.message}`);
  }
};

/**
 * Get admissions by patient ID
 * @param {String} patientId - Patient ID
 * @returns {Array} - Array of patient's admissions
 */
export const getAdmissionsByPatient = async (patientId) => {
  try {
    const admissions = await Admission.find({ patientId })
      .populate('wardId bedId doctorId')
      .sort({ createdAt: -1 });
    return admissions;
  } catch (error) {
    throw new Error(`Error fetching patient admissions: ${error.message}`);
  }
};