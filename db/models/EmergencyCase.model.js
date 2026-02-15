import mongoose from "mongoose";

const { Schema } = mongoose;

const emergencyCaseSchema = new Schema(
  {
    temporaryPatientName: {
      type: String,
      trim: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },

    severityLevel: {
      type: String,
      required: [true, "Severity level is required"],
      enum: {
        values: ["LOW", "MODERATE", "CRITICAL"],
        message: "{VALUE} is not a valid severity level",
      },
      uppercase: true,
    },

    triageNotes: {
      type: String,
      required: [true, "Triage notes are required"],
      trim: true,
      maxlength: [2000, "Triage notes cannot exceed 2000 characters"],
    },

    chiefComplaint: {
      type: String,
      trim: true,
      maxlength: [500, "Chief complaint cannot exceed 500 characters"],
    },

    vitalSigns: {
      temperature: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      pulse: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: [
          "REGISTERED",
          "ADMITTED",
          "DISCHARGED",
          "REFERRED",
          "DECEASED",
        ],
        message: "{VALUE} is not a valid status",
      },
      uppercase: true,
      default: "REGISTERED",
    },

    handledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    admissionId: {
      type: Schema.Types.ObjectId,
      ref: "Admission",
    },

    referredTo: {
      facilityName: String,
      reason: String,
      referredAt: Date,
    },

    arrivedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
emergencyCaseSchema.index({ patientId: 1 });
emergencyCaseSchema.index({ severityLevel: 1, status: 1 });
emergencyCaseSchema.index({ status: 1, arrivedAt: -1 });

// Virtual: display name
emergencyCaseSchema.virtual("displayName").get(function () {
  if (this.populated("patientId") && this.patientId) {
    return `${this.patientId.firstName} ${this.patientId.lastName}`;
  }
  return this.temporaryPatientName || "Unidentified";
});

// Instance method: Admit
emergencyCaseSchema.methods.admit = async function (admissionData) {
  if (!this.patientId) {
    throw new Error("Patient must be identified before admission");
  }

  const Admission = mongoose.model("Admission");
  const admission = await Admission.create({
    ...admissionData,
    patientId: this.patientId,
    admissionType: "EMERGENCY",
  });

  this.status = "ADMITTED";
  this.admissionId = admission._id;
  this.resolvedAt = new Date();

  await this.save();
  return admission;
};

// Static method: Get active
emergencyCaseSchema.statics.getActive = function () {
  return this.find({
    status: { $in: ["REGISTERED", "ADMITTED"] },
  })
    .populate("patientId", "firstName lastName patientId")
    .populate("handledBy", "firstName lastName")
    .sort({ severityLevel: 1, arrivedAt: 1 });
};

// Get critical
emergencyCaseSchema.statics.getCritical = function () {
  return this.find({
    severityLevel: "CRITICAL",
    status: { $in: ["REGISTERED", "ADMITTED"] },
  })
    .populate("patientId", "firstName lastName patientId")
    .sort({ arrivedAt: 1 });
};

const EmergencyCase = mongoose.model("EmergencyCase", emergencyCaseSchema);

export default EmergencyCase;
