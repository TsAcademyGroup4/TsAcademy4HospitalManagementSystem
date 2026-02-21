import User from "../db/models/User.model.js";

//Find a user by email
export const findByEmail = (email) => {
    return User.findOne({ email });
};

//Create a new user
export const create = (data) => {
    const user = new User(data);
    return user.save();
};


 //Find users with filters, pagination, and populate department
export const findWithFilters = (filter, skip, limit) => {
    return User.find(filter)
        .populate("departmentId", "name") // populate only department name
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // newest first
};

// Count documents matching filter

export const count = (filter) => {
    return User.countDocuments(filter);
};

//Soft delete (deactivate) a user

export const deactivate = (userId) => {
    return User.findOneAndUpdate(
        { _id: userId, isActive: true },
        { isActive: false },
        { new: true }
    );
};