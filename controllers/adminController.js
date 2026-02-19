import * as adminService from "../services/adminService.js";

//Create a new user (admin)
//POST /admin/users

export const createUser = async (req, res) => {
    try {
        const user = await adminService.createUser(req.body);
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

//Get paginated list of users
//GET /admin/users?page=1&limit=10&role=DOCTOR&departmentId=...
export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getUsers(req.query);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

//Deactivate a user (soft delete)
//DELETE /admin/users/:userId
export const deactivateUser = async (req, res) => {
    try {
        const user = await adminService.deactivateUser(req.params.userId);
        res.status(200).json({
            message: "User deactivated successfully",
            user,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};