import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db/config/database.js";
import wardRoutes from "./routes/ward.routes.js";
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
app.use("/wards", wardRoutes);

// ----------------------
// Start server
// ----------------------
function StartApplication() {
  try {
    connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

StartApplication();
