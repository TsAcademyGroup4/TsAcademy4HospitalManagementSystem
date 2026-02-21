import express from "express";
import { getAllAvailableBeds } from "../controllers/ward.controllers.js";

const router = express.Router();

router.get("/available-beds", getAllAvailableBeds);

export default router;
