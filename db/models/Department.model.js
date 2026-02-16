import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Desription cannot exceed 500 characters"],
    },

    code: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: [10, "Department codee cannot exceed 10 characters"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
departmentSchema.index({ code: 1 });

// Virtual: Staff count
departmentSchema.virtual("staffCount", {
  ref: "User",
  localField: "_id",
  foreignField: "departmentId",
  count: true,
});

// Static method: Find by name
departmentSchema.statics.findByName = function (name) {
  return this.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
};

// Get active departments
departmentSchema.statics.getActiveDepartments = function () {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Instance metjod: Get staff
departmentSchema.methods.getStaff = async function () {
  const User = mongoose.model("User");
  return await User.find({ departmentId: this._id, isActive: true });
};

// Get doctors
departmentSchema.methods.getDoctors = async function () {
  const User = mongoose.model("User");
  return await User.find({
    departmentId: this._id,
    role: "DOCTOR",
    isActive: true,
  });
};

const Department = mongoose.model("Department", departmentSchema);

export default Department;
