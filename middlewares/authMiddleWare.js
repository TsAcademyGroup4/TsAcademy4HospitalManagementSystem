import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

/**
 * Authentication middleware
 * This middleware verifies the JWT token sent in the Authorization header modified the request object to include the decoded token data (user ID, role, departmentId) for use in other handlers.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");

    // Attaching decoded JWT to req.auth
    req.auth = jwt.verify(token, secret);

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
/**
 * Authorize middleware
 * Uses closure to allow dynamic role-based access control
 * @param {string[]} allowedRoles - list of roles allowed to access the route
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.auth.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};