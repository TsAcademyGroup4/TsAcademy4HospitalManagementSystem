import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db/config/database";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to TsAcademy Group 4 Project" });
});

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
