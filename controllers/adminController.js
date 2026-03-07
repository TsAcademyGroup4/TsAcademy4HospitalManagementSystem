import * as adminService from "../services/adminService.js";
import { StatusCodes } from "http-status-codes";

// Create a new user
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
            success: true,
            data: user,
        });
    } catch (err) {
            res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
    };

    // Get users
    export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getUsers(req.query);
        res.status(StatusCodes.OK).json({
            message: "Users retrieved successfully",
            success: true,
            data: result,
        });
    } catch (err) {
            res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
    };

    // Deactivate user
    export const deactivateUser = async (req, res) => {
    try {
        const user = await adminService.deactivateUser(req.params.userId);
        res.status(StatusCodes.OK).json({
            message: "User deactivated successfully",
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};

// Create a new department
export const createDepartment = async (req, res) => {
    try {
        const { name, description, code } = req.body;
        // Required field validation
        if (!name || !name.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Department name is required" });
        }
        const department = await adminService.createDepartment({ name, description, code });
        res.status(StatusCodes.CREATED).json({
            message: "Department created successfully",
            success: true,
            data: department,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};

// Get all departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await adminService.getDepartments(req.query);
        res.status(StatusCodes.OK).json({
            message: "Departments retrieved successfully",
            success: true,
            data: departments,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const { departmentId } = req.params;
        if (!departmentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Department ID is required" });
        }
        const department = await adminService.getDepartmentById(departmentId);
        res.status(StatusCodes.OK).json({
            message: "Department retrieved successfully",
            success: true,
            data: department,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        if (!departmentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Department ID is required" });
        }
        const department = await adminService.updateDepartment(departmentId, req.body);
        res.status(StatusCodes.OK).json({
            message: "Department updated successfully",
            success: true,
            data: department,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        if (!departmentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Department ID is required" });
        }
        const result = await adminService.deleteDepartment(departmentId);
        res.status(StatusCodes.OK).json({
            message: result.message,
            success: true,
        });
    } catch (err) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }
};