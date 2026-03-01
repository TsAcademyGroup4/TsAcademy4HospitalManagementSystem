import Patient from "../db/models/Patient.model.js";

/**
 * Create a new patient record
 * @param {Object} patientData - Patient information
 * @returns {Object} - Created patient document
 */

export const createPatient = async (patientData) => {
  try {
    const newPatient = new Patient(patientData);
    await newPatient.save();
    return newPatient;
  } catch (error) {
    throw new Error(`Error creating patient: ${error.message}`);
  }
};

/**
 * Find patient by phone number
 * @param {String} phone - Patient's phone number
 * @returns {Object} - Patient document or null
 */
export const findPatientByPhone = async (phone) => {
  try {
    const patient = await Patient.findOne({ phone, isActive: true });
    return patient;
  } catch (error) {
    throw new Error(`Error finding patient by phone: ${error.message}`);
  }
};

/**
 * Find patient by patient ID (MongoDB _id or patientId)
 * @param {String} patientId - Patient's ID (can be _id or custom patientId)
 * @returns {Object} - Patient document or null
 */
export const findPatientById = async (patientId) => {
  try {
    let patient = await Patient.findById(patientId);   
    // If not found by MongoDB _id, try finding by custom patientId
    if (!patient) {
      patient = await Patient.findByPatientId(patientId);
    }
    return patient;
  } catch (error) {
    throw new Error(`Error finding patient by ID: ${error.message}`);
  }
};

/**
 * Search patients by phone number and name
 * @param {String} phone - Patient's phone number
 * @param {String} name - Patient's name (first or last)
 * @returns {Array} - Array of matching patient documents
 */
export const findPatientByPhoneAndName = async (phone, name) => {
  try {
    const patients = await Patient.find({
      $and: [
        { phone: { $regex: phone } },
        {
          $or: [
            { firstName: { $regex: name, $options: "i" } },
            { lastName: { $regex: name, $options: "i" } },
          ],
        },
      ],
      isActive: true,
    });
    
    return patients;
  } catch (error) {
    throw new Error(`Error searching patients: ${error.message}`);
  }
};

/**
 * Get all active patients
 * @returns {Array} - Array of all active patients
 */
export const getAllPatients = async () => {
  try {
    const patients = await Patient.find({ isActive: true })
      .sort({ createdAt: -1 });
    return patients;
  } catch (error) {
    throw new Error(`Error fetching patients: ${error.message}`);
  }
};

/**
 * Update patient information
 * @param {String} patientId - Patient's ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated patient document
 */
export const updatePatient = async (patientId, updateData) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    );
    return patient;
  } catch (error) {
    throw new Error(`Error updating patient: ${error.message}`);
  }
};

/**
 * Delete (deactivate) a patient
 * @param {String} patientId - Patient's ID
 * @returns {Object} - Deactivated patient document
 */
export const deletePatient = async (patientId) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { isActive: false },
      { new: true }
    );
    return patient;
  } catch (error) {
    throw new Error(`Error deleting patient: ${error.message}`);
  }
};

/**
 * Search patients using the schema's static search method
 * @param {String} searchTerm - Search term (name or phone)
 * @returns {Array} - Array of matching patients
 */
export const searchPatients = async (searchTerm) => {
  try {
    const patients = await Patient.search(searchTerm);
    return patients;
  } catch (error) {
    throw new Error(`Error searching patients: ${error.message}`);
  }
};