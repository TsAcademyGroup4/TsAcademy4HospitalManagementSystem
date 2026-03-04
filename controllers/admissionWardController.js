import { StatusCodes } from "http-status-codes";
export * as admissionWardService from "../services/admissionWardService.js";

// controllers/admissionWardController.js this handles admission ward  operation to get available beds and takes in a query string of wardType
// response expected is a list of beds based on the DB schema.
export const getAvailableBeds = async (req, res) => {
    try {
        const wardType = req.query.wardType || "general"; // default to general if not provided
        if(!wardType) throw new Error("wardType query parameter is required");         
        const beds = await admissionWardService.getAvailableBeds(wardType);
        res.status(StatusCodes.OK).json(beds);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const createWardAdmission = async (req, res) => {
    try{
        const { patientId, wardId, doctorId, bedId, admissionType } = req.body;
        if(!patientId || !wardId || !doctorId || !bedId || !admissionType) throw new Error("All fields are required");
        admissionWardService.createWardAdmission({ patientId, wardId, doctorId, bedId, admissionType });
        res.status(StatusCodes.CREATED).json({ message: "Ward admission created successfully" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const updatePatientVitals = async (req, res) => {
    try{
        const admissionId = req.params.admissionId;
        if(!admissionId) throw new Error("Admission ID is required");
        // Call the service to update patient vitals
        admissionWardService.updatePatientVitals(admissionId, req.body);
        res.status(StatusCodes.CREATED).json({ message: "Patient vitals updated successfully" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export const dischargePatient = async (req, res) => {
    try{
        const admissionId = req.params.admissionId;
        const {dischargeSummary, dischargeDate} = req.body;
        if(!dischargeSummary || !dischargeDate) throw new Error("Discharge summary and discharge date are required");
        admissionWardService.dischargePatient(dischargeSummary, dischargeDate);
        res.status(StatusCodes.OK).json({ message: "Patient Discharged Successfully"});
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
