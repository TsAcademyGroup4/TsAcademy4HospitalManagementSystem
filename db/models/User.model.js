import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"],
    },

    role: {
      type: String,
      required: [true, "User role is rquired"],
      enum: {
        values: [
          "ADMIN",
          "DOCTOR",
          "FRONT_DESK",
          "NURSE",
          "PHARMACY",
          "BILLING",
        ],
        message: "{VALUE} is not a valid role",
      },
      uppercase: true,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        return ["DOCTOR", "NURSE"].includes(this.role);
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
userSchema.index({ role: 1, departmentId: 1 });
userSchema.index({ isActive: 1 });

// Virtual: fullName
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save: Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (error) {
    next(error);
  }
});

// Instance method; Caompare passsword
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Safe object
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

// Static method: Find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Find by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role: role.toUpperCase(), isActive: true });
};

// Find doctors by department
userSchema.statics.findDoctorsByDepartment = function (departmentId) {
  return this.find({
    role: "DOCTOR",
    departmentId,
    isActive: true,
  }).populate("departmentId");
};

const User = mongoose.model("User", userSchema);

export default User;
