import mongoose from "mongoose";
import User from "../db/models/User.model.js";
import Department from "../db/models/Department.model.js";

// Create a new user (admin)
//POST /admin/users
export const createUser = async(req, res) => {
    try{
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            phone, 
            role, 
            departmentId,
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: "firstName, lastName, email, password, and role are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        //Check existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        //Validate departmentID if provided
        if (departmentId && !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        //Check department exists if departmentId provided)
        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(400).json({ message: "Department not found" });
            }
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            role: role.toUpperCase(),
            departmentId,
            passwordHash: password, // hashed by model hook
        });

        await user.save();

        res.status(201).json({ 
            message: "User created successfully", 
            user: user.toSafeObject(), // Return user data without sensitive info
        });

    }catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({ message: err.message });
    }
};


//Get paginated list of users (exclude passwordHash)
//GET /admin/users?page=1
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isActive: true }; // Only active users

        //Options to filter by role or department
        if (req.query.role) {
            filter.role = req.query.role;
        }

        if (req.query.departmentId) {
            filter.departmentId = req.query.departmentId;
        }

        const users = await User.find(filter)
            .populate("departmentId", "name") // Populate department name
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first
        
        const total = await User.countDocuments(filter);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            users: users.map(u => u.toSafeObject()), // Return safe user data
        });
    }catch(err){
        console.error("Error fetching users:", err);
        res.status(500).json({ message: err.message });
    }
};


// Deactivate a user (soft delete)
//DELETE /admin/users/:userId
export const deactivateUser = async (req, res) => {
    try{
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { isActive: false },
            { new: true }
        );
        /*const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true } // Return the updated user
        );
        */

        if (!user) {
            return res.status(404).json({ message: "User not found or already deactivated" });
        }

        res.status(200).json({ 
            message: "User deactivated successfully", 
            user: user.toSafeObject() 
        });

    }catch(err){
        console.error("Error deactivating user:", err);
        res.status(500).json({ message: err.message });
    }
};