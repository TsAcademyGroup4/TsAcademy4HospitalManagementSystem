import express from "express";
import appointmentController from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", appointmentController.create);

router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);

router.put("/:appointmentId", appointmentController.update);

router.delete("/:appointmentId", appointmentController.cancel);

export default router;
