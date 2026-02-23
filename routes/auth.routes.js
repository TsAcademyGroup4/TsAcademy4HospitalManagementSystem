import { login } from "../controllers/auth.controllers";
import express from "express";

const router = express.Router();

router.post("/:actor/login", login);

export default router;
