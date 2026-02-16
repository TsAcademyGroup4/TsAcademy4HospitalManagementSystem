import mongoose from "mongoose";

const { Schema } = mongoose;

const consultationSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: [true, "Doctor is required"],
    },

    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    labRequests: [
      {
        type: String,
        trim: true,
      },
    ],

    outcome: {
      type: String,
      required: [true, "Outcome is required"],
      enum: {
        values: ["DISCHARGED", "PHARMACY", "ADMITTED", "REFERRED", "FOLLOW_UP"],
        message: "{VALUE} is not a valid outcome",
      },
      uppercase: true,
    },

    refferedTo: {
      departmentId: {
        type: Schema.Types.ObjectId,
        ref: "Department",
      },
      doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reason: String,
    },

    followUpDate: {
      type: Date,
    },

    consultationDate: {
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
consultationSchema.index({ patientId: 1, consultationDate: -1 });
consultationSchema.index({ doctorId: 1, consultationDate: -1 });
consultationSchema.index({ appointmentId: 1 });

// Instance method: Get prescription
consultationSchema.methods.getPrescription = async function () {
  const Prescription = mongoose.model("Prescription");
  return await Prescription.findOne({ consultationId: this._id });
};

// Create follow up
consultationSchema.methods.createFollowUp = async function () {
  if (!this.followUpDate) {
    throw new Error("Follow-up date not set");
  }

  const Appointment = mongoose.model("Appointment");
  return await Appointment.create({
    patientId: this.patientId,
    doctorId: this.doctorId,
    appointmentDate: this.followUpDate,
    type: "FOLLOW_UP",
    reasonsForVisit: "Follow-up consultation",
  });
};

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
