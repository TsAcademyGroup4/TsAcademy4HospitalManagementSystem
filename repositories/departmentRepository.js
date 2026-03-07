// repositories/departmentRepository.js
import Department from "../db/models/Department.model.js";

export const findByName = (name) => {
    return Department.findOne({ name: name.trim() });
};

export const findById = (id) => {
    return Department.findById(id);
};

export const create = (data) => {
    return Department.create(data);
};

export const findAll = (filter = {}, options = {}) => {
    return Department.find(filter, null, options);
};

export const updateById = (id, data) => {
    return Department.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteById = (id) => {
    return Department.findByIdAndDelete(id);
};