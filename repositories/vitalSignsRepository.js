import VitalSigns from "../db/models/VitalSigns.model.js";

/**
 * Create new vital signs record
 * @param {Object} vitalData - Vital signs information
 * @returns {Object} - Created vital signs document
 */
export const createVitalSigns = async (vitalData) => {
  try {
    const newVitalSigns = new VitalSigns(vitalData);
    await newVitalSigns.save();
    return newVitalSigns;
  } catch (error) {
    throw new Error(`Error creating vital signs: ${error.message}`);
  }
};

/**
 * Update vital signs for an admission
 * @param {String} admissionId - Admission ID
 * @param {Object} vitalData - Vital signs data to update
 * @returns {Object} - Updated vital signs document
 */
export const updateVitalSigns = async (admissionId, vitalData) => {
  try {
    // Find existing vital signs for this admission (most recent)
    const existingVitals = await VitalSigns.findOne({ admissionId })
      .sort({ recordedAt: -1 });

    if (existingVitals) {
      // Update existing record
      Object.assign(existingVitals, vitalData, { recordedAt: new Date() });
      await existingVitals.save();
      return existingVitals;
    } else {
      // Create new record
      const newVitals = new VitalSigns({
        admissionId,
        ...vitalData
      });
      await newVitals.save();
      return newVitals;
    }
  } catch (error) {
    throw new Error(`Error updating vital signs: ${error.message}`);
  }
};

/**
 * Get vital signs by admission ID
 * @param {String} admissionId - Admission ID
 * @returns {Array} - Array of vital signs records
 */
export const getVitalSignsByAdmission = async (admissionId) => {
  try {
    const vitalSigns = await VitalSigns.find({ admissionId })
      .sort({ recordedAt: -1 });
    return vitalSigns;
  } catch (error) {
    throw new Error(`Error fetching vital signs: ${error.message}`);
  }
};

/**
 * Get latest vital signs for an admission
 * @param {String} admissionId - Admission ID
 * @returns {Object} - Latest vital signs record or null
 */
export const getLatestVitalSigns = async (admissionId) => {
  try {
    const latestVitals = await VitalSigns.findOne({ admissionId })
      .sort({ recordedAt: -1 });
    return latestVitals;
  } catch (error) {
    throw new Error(`Error fetching latest vital signs: ${error.message}`);
  }
};