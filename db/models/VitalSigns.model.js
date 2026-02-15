import mongoose from "mongoose";

const { Schema } = mongoose;

const vitalSignsSchema = new Schema(
  {
    admissionId: {
      type: Schema.Types.ObjectId,
      ref: "Admission",
      required: [true, "Admission is required"],
    },

    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recorder is required"],
    },

    temperature: {
      type: Number,
      min: [30, "Temperature seems too low"],
      max: [45, "Temperature seems too high"],
    },

    bloodPressure: {
      systolic: {
        type: Number,
        min: 0,
      },
      diastolic: {
        type: Number,
        min: 0,
      },
    },

    pulse: {
      type: Number,
      min: [0, "Pulse cannot be negative"],
      max: [300, "Pulse seems too high"],
    },

    respiratoryRate: {
      type: Number,
      min: [0, "Respiratory rate cannot be negative"],
      max: [100, "Respiratory rate seems too high"],
    },

    oxygenSaturation: {
      type: Number,
      min: [0, "Oxygen saturation must be between 0-100"],
      max: [100, "Oxygen saturation must be between 0-100"],
    },

    bloodGlucose: {
      type: Number,
      min: 0,
    },

    weight: {
      type: Number,
      min: 0,
    },

    height: {
      type: Number,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
vitalSignsSchema.index({ admissionId: 1, recordedAt: -1 });
vitalSignsSchema.index({ recordedBy: 1 });

// Virtual: BMI
vitalSignsSchema.virtual("bmi").get(function () {
  if (!this.weight || !this.height) return null;
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(2);
});

// Blood pressure formatted
vitalSignsSchema.virtual("bloodPressureFormatted").get(function () {
  if (
    !this.bloodPressure ||
    !this.bloodPressure.systolic ||
    !this.bloodPressure.diastolic
  ) {
    return null;
  }
  return `${this.bloodPressure.systolic}/${this.bloodPressure.diastolic}`;
});

// Static method: Get trend
vitalSignsSchema.statics.getTrend = function (
  admissionId,
  vitalType,
  hours = 24,
) {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hours);

  return this.find({
    admissionId,
    recordedAt: { $gte: cutoffTime },
  })
    .sort({ recordedAt: 1 })
    .select(`${vitalType} recordedAt`);
};

const VitalSigns = mongoose.model("VitalSigns", vitalSignsSchema);

export default VitalSigns;
