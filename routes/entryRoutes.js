import express from "express";

const router = express.Router();
router.get("/", entryController.greetingMessage);

export default router;