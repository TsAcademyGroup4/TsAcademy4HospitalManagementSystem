import jwt from "jsonwebtoken";
import User from "../db/models/User.model.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const authMiddleware = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "No token provided. Authorization denied.",
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET not configured");

        // Verify token
        const decoded = jwt.verify(token, secret);

        // Attach user
        const user = await User.findById(decoded.sub);
        if (!user || !user.isActive) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "User not found or inactive",
            });
        }

        // Attach safe user object to request
        req.user = user.toSafeObject();

        next();
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid or expired token",
        });
    }
};