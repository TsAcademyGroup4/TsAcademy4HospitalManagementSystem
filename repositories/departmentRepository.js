// repositories/departmentRepository.js
import Department from "../db/models/Department.model.js";

export const findByName = (name) => {
    return Department.findOne({ name: name.trim() });
};
export const findById = (id) => {
    return Department.findById(id);
};