import mongoose from "mongoose";

const { Schema } = mongoose;

const admissionSchema = new Schema(
  {
    admissionNumber: {
      type: String,
      unique: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor s requied"],
    },

    wardId: {
      type: Schema.Types.ObjectId,
      ref: "Ward",
      required: [true, "Ward is required"],
    },

    bedId: {
      type: Schema.Types.ObjectId,
      ref: "Bed",
      required: false,
    },

    admissionType: {
      type: String,
      required: [true, "Admission type is required"],
      enum: {
        values: ["NORMAL", "EMERGENCY", "TRANSFER"],
        message: "{VALUE} is not aq valid admission type",
      },
      uppercase: true,
      default: "NORMAL",
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["ACTIVE", "DISCHARGED", "TRANSFERRED"],
        message: "{VALUE} is not a valid status",
      },
      uppercase: true,
      default: "ACTIVE",
    },

    admissionReason: {
      type: String,
      trim: true,
      maxlength: [1000, "Admission reason cannot exceed 1000 characters"],
    },

    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expectedDischargeDate: {
      type: Date,
    },

    dischargeDate: {
      type: Date,
    },

    dischargeSummary: {
      type: String,
      trim: true,
      maxlength: [2000, "Discarge summary cannot exceed 2000 characters"],
    },

    medications: [
      {
        drugName: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
admissionSchema.index({ patientId: 1, admissionDate: -1 });
admissionSchema.index({ doctorId: 1, status: 1 });
admissionSchema.index({ wardId: 1, status: 1 });
admissionSchema.index({ bedId: 1 });
admissionSchema.index({ status: 1, admissionDate: -1 });

// Virtual: length of stay
admissionSchema.virtual("lengthOfStay").get(function () {
  const endDate = this.dischargeDate || new Date();
  const startDate = this.admissionDate;
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save: Auto-generate admission number
admissionSchema.pre("save", async function () {
  if (!this.isNew) return;

  const lastAdmission = await this.constructor
    .findOne({}, { admissionNumber: 1 })
    .sort({ admissionNumber: -1 })
    .lean();

  let nextNumber = 1;
  if (lastAdmission && lastAdmission.admissionNumber) {
    const lastNumber = parseInt(lastAdmission.admissionNumber.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  this.admissionNumber = `ADM-${String(nextNumber).padStart(5, "0")}`;
});

// Mark bed as occupied
admissionSchema.pre("save", async function () {
  if (this.isNew && this.status === "ACTIVE" && this.bedId) {
    try {
      const Bed = mongoose.model("Bed");
      await Bed.findByIdAndUpdate(this.bedId, { status: "OCCUPIED" });
    } catch (error) {
      console.error("Error updating bed status:", error.message);
    }
  }
});

// Instance method: Get vital signs
admissionSchema.methods.getVitalSigns = async function () {
  const VitalSigns = mongoose.model("VitalSigns");
  return await VitalSigns.find({ admissionId: this._id }).sort({
    recordedAt: -1,
  });
};

// Discharge
admissionSchema.methods.discharge = async function (summary) {
  this.status = "DISCHARGED";
  this.dischargeDate = new Date();
  this.dischargeSummary = summary;

  const Bed = mongoose.model("Bed");
  await Bed.findByIdAndUpdate(this.bedId, { status: "AVAILABLE" });

  return await this.save();
};

// Static method: Get active by ward
admissionSchema.statics.getActiveByWard = function (wardId) {
  return this.find({
    wardId,
    status: "ACTIVE",
  })
    .populate("patientId", "firstName lastName patientId")
    .populate("doctorId", "firstName lastName")
    .populate("bedId", "bedNumber");
};

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
