import mongoose from "mongoose";
import * as userRepository from "../repositories/userRepository.js";
import * as departmentRepository from "../repositories/departmentRepository.js";
import { StatusCodes } from "http-status-codes";

//Create a new user (admin)

export const createUser = async (data) => {
    const { firstName, lastName, email, password, phone, role, departmentId } = data;
    const normalizedEmail = email.toLowerCase();
    // Check duplicate email
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
        throw { statusCode: StatusCodes.CONFLICT, message: "User with this email already exists" };
    }

    // Validate department if provided
    if (departmentId) {
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw { statusCode: StatusCodes.NOT_FOUND, message: "Invalid department ID" };
        }

        const department = await departmentRepository.findById(departmentId);
        if (!department) {
            throw { statusCode: StatusCodes.NOT_FOUND, message: "Department not found" };
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
        throw { statusCode: StatusCodes.NOT_FOUND, message: "User not found or already deactivated" };
    }

    return user.toSafeObject();
};

// Create a new department
export const createDepartment = async (data) => {
    const { name, description, code } = data;
    // Check for duplicate name
    const existingDepartment = await departmentRepository.findByName(name);
    if (existingDepartment) {
        throw { statusCode: StatusCodes.CONFLICT, message: "Department with this name already exists" };
    }

    // Sanitize input: only allow name, description, code
    const departmentData = {
        name: name.trim(),
        description: description ? description.trim() : undefined,
        code: code ? code.trim().toUpperCase() : undefined,
    };

    const department = await departmentRepository.create(departmentData);
    return department;
};

// Get all departments
export const getDepartments = async (query) => {
    const filter = {};
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }

    const options = {
        sort: { name: 1 },
    };

    const departments = await departmentRepository.findAll(filter, options);
    return departments;
};

// Get department by ID
export const getDepartmentById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid department ID" };
    }

    const department = await departmentRepository.findById(id);
    if (!department) {
        throw { statusCode: StatusCodes.NOT_FOUND, message: "Department not found" };
    }

    return department;
};

// Update department
export const updateDepartment = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid department ID" };
    }

    const { name, description, code, isActive } = data;

    // Check if department exists
    const existingDepartment = await departmentRepository.findById(id);
    if (!existingDepartment) {
        throw { statusCode: StatusCodes.NOT_FOUND, message: "Department not found" };
    }

    // Check for duplicate name if name is being updated
    if (name && name.trim() !== existingDepartment.name) {
        const duplicate = await departmentRepository.findByName(name);
        if (duplicate) {
            throw { statusCode: StatusCodes.CONFLICT, message: "Department with this name already exists" };
        }
    }

    // Sanitize input
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : undefined;
    if (code !== undefined) updateData.code = code ? code.trim().toUpperCase() : undefined;
    if (isActive !== undefined) updateData.isActive = isActive;

    const department = await departmentRepository.updateById(id, updateData);
    return department;
};

// Delete department
export const deleteDepartment = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid department ID" };
    }

    const department = await departmentRepository.findById(id);
    if (!department) {
        throw { statusCode: StatusCodes.NOT_FOUND, message: "Department not found" };
    }

    // Check if department has staff
    const staffCount = await department.staffCount; // virtual
    if (staffCount > 0) {
        throw { statusCode: StatusCodes.CONFLICT, message: "Cannot delete department with active staff" };
    }

    await departmentRepository.deleteById(id);
    return { message: "Department deleted successfully" };
};