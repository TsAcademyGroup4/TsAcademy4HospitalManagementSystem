import mongoose from "mongoose";
import * as userRepository from "../repositories/userRepository.js";
import * as departmentRepository from "../repositories/departmentRepository.js";

//Create a new user (admin)

export const createUser = async (data) => {
    const { firstName, lastName, email, password, phone, role, departmentId } = data;

    // Required field validation
    if (!firstName || !lastName || !email || !password || !role) {
        throw { statusCode: 400, message: "Required fields missing" };
    }

    if (password.length < 8) {
        throw { statusCode: 400, message: "Password must be at least 8 characters" };
    }

    const normalizedEmail = email.toLowerCase();

    // Check duplicate email
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
        throw { statusCode: 400, message: "User with this email already exists" };
    }

    // Validate department if provided
    if (departmentId) {
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw { statusCode: 400, message: "Invalid department ID" };
        }

        const department = await departmentRepository.findById(departmentId);
        if (!department) {
            throw { statusCode: 400, message: "Department not found" };
        }
    }

    // Create user — Mongoose schema handles role enum & uppercase, password hash via pre-save hook
    const user = await userRepository.create({
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        role,
        departmentId,
        passwordHash: password,
    });

    return user.toSafeObject();
};


// Get paginated list of users
export const getUsers = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100); // max 100 per page
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (query.role) {
        filter.role = query.role.toUpperCase(); // match schema uppercase
    }

    if (query.departmentId) {
        filter.departmentId = query.departmentId;
    }

    const users = await userRepository.findWithFilters(filter, skip, limit);
    const total = await userRepository.count(filter);

    return {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        users: users.map(u => u.toSafeObject()),
    };
};


//Deactivate a user (soft delete)
export const deactivateUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw { statusCode: 400, message: "Invalid user ID" };
    }

    const user = await userRepository.deactivate(userId);

    if (!user) {
        throw { statusCode: 404, message: "User not found or already deactivated" };
    }

    return user.toSafeObject();
};