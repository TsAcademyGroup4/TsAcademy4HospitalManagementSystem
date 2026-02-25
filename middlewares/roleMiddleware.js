import { StatusCodes } from "http-status-codes";

/**
 * Usage: authorizeRoles("ADMIN", "PHARMACY")
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "User not authenticated",
        });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
            message: "You do not have permission to perform this action",
        });
        }

        next();
    };
};