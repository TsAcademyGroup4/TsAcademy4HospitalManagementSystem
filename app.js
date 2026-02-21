import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import loginRoute from "./routes/auth.routes.js";
import { connectDB } from "./db/config/database.js";
import departmentRoutes from "./routes/department.routes.js";

const app = express();
const PORT = process.env.PORT || 8081;

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", loginRoute);
app.use("/api/admin", departmentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to TsAcademy Group 4 Project" });
});

async function startApplication() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

startApplication();
