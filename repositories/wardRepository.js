import Ward from "../db/models/Ward.model.js";
import Bed from "../db/models/Bed.model.js";

/**
 * Get available beds by ward type
 * @param {String} wardType - Type of ward (e.g., 'GENERAL', 'ICU', 'MATERNITY')
 * @returns {Array} - Array of available beds with ward info
 */
export const getAvailableBeds = async (wardType) => {
  try {
    // Find wards of the specified type
    const wards = await Ward.find({ type: wardType, isActive: true });
    if (!wards.length) {
      throw new Error(`No ${wardType} wards found`);
    }
    const wardIds = wards.map(ward => ward._id);
    // Find available beds in these wards
    const availableBeds = await Bed.find({
      wardId: { $in: wardIds },
      status: 'AVAILABLE',
      isActive: true
    }).populate('wardId', 'name type floor capacity');
    return availableBeds;
  } catch (error) {
    throw new Error(`Error fetching available beds: ${error.message}`);
  }
};
/**
 * Get all wards
 * @returns {Array} - Array of all active wards
 */
export const getAllWards = async () => {
  try {
    const wards = await Ward.find({ isActive: true })
      .sort({ name: 1 });
    return wards;
  } catch (error) {
    throw new Error(`Error fetching wards: ${error.message}`);
  }
};
/**
 * Find ward by ID
 * @param {String} wardId - Ward ID
 * @returns {Object} - Ward document or null
 */
export const findWardById = async (wardId) => {
  try {
    const ward = await Ward.findById(wardId);
    return ward;
  } catch (error) {
    throw new Error(`Error finding ward: ${error.message}`);
  }
};
/**
 * Get beds by ward ID
 * @param {String} wardId - Ward ID
 * @returns {Array} - Array of beds in the ward
 */
export const getBedsByWard = async (wardId) => {
  try {
    const beds = await Bed.find({ wardId, isActive: true })
      .sort({ bedNumber: 1 });
    return beds;
  } catch (error) {
    throw new Error(`Error fetching beds: ${error.message}`);
  }
};
/**
 * Get single bed by ID
 * @param {String} bedId - Bed ID
 * @returns {Object} - Bed document or null
 */
export const getBedById = async (bedId) => {
  try {
    const bed = await Bed.findById(bedId).populate('wardId');
    return bed;
  } catch (error) {
    throw new Error(`Error fetching bed: ${error.message}`);
  }
};

/**
 * Update bed status
 * @param {String} bedId - Bed ID
 * @param {String} status - New status ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')
 * @returns {Object} - Updated bed document
 */
export const updateBedStatus = async (bedId, status) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      bedId,
      { status },
      { new: true, runValidators: true }
    );
    return bed;
  } catch (error) {
    throw new Error(`Error updating bed status: ${error.message}`);
  }
};