import * as adminService from "../services/adminService.js";
import { StatusCodes } from "http-status-codes";

//Create a new user (admin)
//POST /admin/users
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role, departmentId } = req.body;
        // Required field validation
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Required fields missing" });
        }
        if (password.length < 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 8 characters" });
        }

        const user = await adminService.createUser(req.body);
        res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            user,
        });
    } catch (err) {
        res
            .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
};

//Get paginated list of users
//GET /admin/users?page=1&limit=10&role=DOCTOR&departmentId=...

export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getUsers(req.query);
        res.status(StatusCodes.OK).json(result);
    } catch (err) {
        res
            .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
};

//Deactivate a user (soft delete)
//DELETE /admin/users/:userId
export const deactivateUser = async (req, res) => {
    try {
        const user = await adminService.deactivateUser(req.params.userId);
        res.status(StatusCodes.OK).json({
            message: "User deactivated successfully",
            user,
        });
    } catch (err) {
        res
            .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
};