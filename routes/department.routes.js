import express from "express";
import { createDepartment } from "../controllers/department.controllers.js";

const router = express.Router();

router.post("/", createDepartment);

export default router;
