import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

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