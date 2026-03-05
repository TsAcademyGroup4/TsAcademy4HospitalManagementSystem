import adminRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import admissionWardRoutes from "./routes/admissionWardRoute.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";

import entryRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5050;
// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// ----------------------
// Routes
// ----------------------
app.get("/api/v1", entryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/admissions", admissionWardRoutes);
app.use("/api/v1/pharmacy", pharmacyRoutes);
export default app;