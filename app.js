import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db/config/database.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
import appointmentRoutes from "./routes/appointment.routes.js";


const app = express();
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
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to TsAcademy Group 4 Project" });
});

app.use("/appointments", appointmentRoutes);

// ----------------------
// Start server
// ----------------------

async function startApplication() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

startApplication();
