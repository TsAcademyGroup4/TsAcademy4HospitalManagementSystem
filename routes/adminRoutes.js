import express from "express";
import { createUser, getUsers, deactivateUser } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create a new user → ADMIN only
router.post(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createUser
);

// Get paginated users → ADMIN only
router.get(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getUsers
);

// Deactivate user → ADMIN only
router.delete(
    "/users/:userId",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deactivateUser
);

export default router;