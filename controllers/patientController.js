import { StatusCodes } from "http-status-codes";
import * as patientService from "../services/patientService.js";

export const registerPatient = async (req, res) => {
  try {
    const {firstName, lastName, dob, gender, phone, address} = req.body;

    if (!firstName || !lastName || !dob || !gender || !phone || !address) {
      throw new Error("All fields required: firstName, lastName, dob, gender, phone, address");
    }
    const patientInformation = await patientService.registerPatient({
        firstName, 
        lastName, 
        dob, 
        gender, 
        phone, 
        address        
    });
    return res.status(StatusCodes.CREATED).json(patientInformation);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getPatientById = async(req,res) => {
    try{
        const patientId = req.params.id;
        if(!patientId) throw new Error("Missing PatientId in request");
        const patientInformation = await patientService.getPatientById(patientId);
        return res.status(StatusCodes.ACCEPTED).json(patientInformation);
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({message: error.message});
    }
}

export const searchPatient = async (req,res) => {
    try{
        const {phone, name} = req.query;
    if(!phone || !name) throw new Error("Missing search parameters: phone and name are required");
    const patientInformation = await patientService.searchPatientByNameAndPhoneNumber({phone, name});
        return res.status(StatusCodes.OK).json(patientInformation);
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({message: error.message})
    }
}