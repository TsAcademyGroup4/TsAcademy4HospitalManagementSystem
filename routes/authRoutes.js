import { login } from "../controllers/authControllers.js";
import express from "express";

const router = express.Router();

router.post("/:actor/login", login);

export default router;
