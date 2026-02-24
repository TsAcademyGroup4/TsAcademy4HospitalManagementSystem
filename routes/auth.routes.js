import { login } from "../controllers/auth.controllers.js";
import express from "express";

const router = express.Router();

router.post("/:actor/login", login);

export default router;
