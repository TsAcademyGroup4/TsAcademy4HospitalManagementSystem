import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },

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

    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: "{VALUE} is not a valid gender",
      },
      uppercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{10,15}$/,
        "Please provide a valid emergency phone number",
      ],
    },

    emergencyContactName: {
      type: String,
      trim: true,
      maxlength: [100, "Emmergency contact name cannot exceed 100 characters"],
    },

    emergencyContactRelation: {
      type: String,
      trim: true,
      maxlength: [50, "Relation cannot exceed 50 characters"],
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      uppercase: true,
    },

    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    cardIssued: {
      type: Boolean,
      default: false,
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
patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ firstName: "text", lastName: "text" });

// Virtual: age
patientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// FullName
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Presave: Auto generate patientId
patientSchema.pre("save", async function () {
  if (!this.isNew) {
    return;
  }

  const lastPatient = await this.constructor
    .findOne({}, { patientId: 1 })
    .sort({ patientId: -1 })
    .lean();

  let nextNumber = 1;

  if (lastPatient && lastPatient.patientId) {
    const lastNumber = parseInt(lastPatient.patientId.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  this.patientId = `PAT-${String(nextNumber).padStart(5, "0")}`;
});

// Instanc method: Get medical history
patientSchema.methods.getMedicalHistory = async function () {
  const Consultation = mongoose.model("Consultation");
  return await Consultation.find({ patientId: this._id })
    .populate("doctorId")
    .sort({ consultationDate: -1 });
};

// Get appointments
patientSchema.methods.getAppointments = async function (status = null) {
  const Appointment = mongoose.model("Appointment");
  const query = { patientId: this._id };

  if (status) {
    query.status = status;
  }

  return await Appointment.find(query)
    .populate("doctorId")
    .populate("departmentId")
    .sort({ appointmentDate: -1 });
};

// Get prescriptions
patientSchema.methods.getPrescriptions = async function () {
  const Prescription = mongoose.model("Prescription");
  return await Prescription.find({ patientId: this._id }).sort({
    createdAt: -1,
  });
};

// Check active admission
patientSchema.methods.hasActiveAdmission = async function () {
  const Admission = mongoose.model("Admission");
  const activeAdmission = await Admission.findOne({
    patientId: this._id,
    status: "ACTIVE",
  });

  return !!activeAdmission;
};

// Static method: Search patients
patientSchema.statics.search = function (searchTerm) {
  return this.find({
    $or: [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm } },
    ],
    isActive: true,
  }).limit(20);
};

// Find by patient ID
patientSchema.statics.findByPatientId = function (patientId) {
  return this.findOne({ patientId, isActive: true });
};

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
