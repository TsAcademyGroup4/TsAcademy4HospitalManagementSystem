import adminRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import entryRoutes from "./routes/authRoutes.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import patientRoutes from "./routes/authRoutes.js";

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
app.get("/", entryRoutes);
app.use("/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/patient", patientRoutes);
export default app;