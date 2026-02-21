import Department from "./../db/models/Department.model.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, description, code } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and Description of department is required" });
    }

    const trimmedName = await name.trim();

    const existingDepartment = await Department.findOne({ trimmedName });

    if (existingDepartment) {
      return res
        .status(400)
        .json({ success: false, message: "Department name aleady exists" });
    }

    const department = await Department.create({
      name: trimmedName,
      description,
      code,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      description: error.message,
    });
  }
};
