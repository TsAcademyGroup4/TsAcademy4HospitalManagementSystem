import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", appointmentController.createAppointment);

router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);

router.put("/:appointmentId", appointmentController.updateAppointment);

router.delete("/:appointmentId", appointmentController.cancelAppointment);

export default router;
