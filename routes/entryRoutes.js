import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();
router.get("/", entryController.greetingMessage);

export default router;
