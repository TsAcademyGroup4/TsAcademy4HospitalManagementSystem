import mongoose from "mongoose";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    appointmentNumber: {
      type: String,
      unique: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (value) {
          if (this.isNew) {
            const appointmentDay = new Date(value).setHours(0, 0, 0, 0);
            const today = new Date().setHours(0, 0, 0, 0);
            return appointmentDay >= today;
          }
          return true;
        },
        message: "Appointment date cannot be in the past",
      },
    },

    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format, Use HH:MM format",
      ],
    },

    type: {
      type: String,
      required: [true, "Appointment type is required"],
      enum: {
        values: ["NORMAL", "EMERGENCY", "FOLLOW_UP"],
        message: "{VALUE} is not a valid appointment type",
      },
      uppercase: true,
      default: "NORMAL",
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: [
          "SCHEDULED",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
          "IN_PROGRESS",
        ],
        message: "{VALUE} is not a valid status",
      },
      uppercase: true,
      default: "SCHEDULED",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reasonForVisit: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [300, "Cancellation reason exceed 300 characters"],
    },

    cancelledAt: {
      type: Date,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ departmentId: 1, appointmentDate: 1 });

// Virtual: fullDateTime
appointmentSchema.virtual("fullDateTime").get(function () {
  if (!this.appointmentDate || !this.timeSlot) return null;

  const [hours, minutes] = this.timeSlot.split(":");
  const dateTime = new Date(this.appointmentDate);
  dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  return dateTime;
});

// isUpcoming
appointmentSchema.virtual("isUpcoming").get(function () {
  if (!this.fullDateTime) return false;
  return this.fullDateTime > new Date() && this.status === "SCHEDULED";
});

// isToday
appointmentSchema.virtual("isToday").get(function () {
  if (!this.appointmentDate) return false;

  const today = new Date();
  const appointmentDay = new Date(this.appointmentDate);

  return today.toDateString() === appointmentDay.toDateString();
});

// Pre save: Autogenerate appointment number
appointmentSchema.pre("save", async function () {
  if (!this.isNew) {
    return;
  }

  const lastAppointment = await this.constructor
    .findOne({}, { appointmentNumber: 1 })
    .sort({ appointmentNumber: -1 })
    .lean();

  let nextNumber = 1;

  if (lastAppointment && lastAppointment.appointmentNumber) {
    const lastNumber = parseInt(
      lastAppointment.appointmentNumber.split("-")[1],
    );
    nextNumber = lastNumber + 1;
  }

  this.appointmentNumber = `APT-${String(nextNumber).padStart(5, "0")}`;
});

// Validate no double booking
appointmentSchema.pre("save", async function () {
  if (
    !this.isModified("appointmentDate") &&
    !this.isModified("timeSlot") &&
    !this.isNew
  ) {
    return;
  }

  const existingAppointment = await this.constructor.findOne({
    doctorId: this.doctorId,
    appointentDate: this.appointentDate,
    timeSlot: this.timeSlot,
    status: { $nin: ["CANCELLED", "NO_SHOW"] },
    _id: { $ne: this._id },
  });

  if (existingAppointment) {
    throw new Error("Doctor already has an appointment at this time");
  }
});

// Instance method: Cancel
appointmentSchema.methods.cancel = async function (reason, cancelledBy) {
  this.status = "CANCELLED";
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  return await this.save();
};

// Complete
appointmentSchema.methods.complete = async function () {
  this.status = "COMPLETED";
  return await this.save();
};

// Mark no-show
appointmentSchema.methods.markNoShow = async function () {
  this.status = "NO_SHOW";
  return await this.save();
};

// Start
appointmentSchema.methods.start = async function () {
  this.status = "IN_PROGRESS";
  return await this.save();
};

// Get consultation
appointmentSchema.methods.getConsultation = async function () {
  const Consultation = mongoose.model("Consultation");
  return await Consultation.findOne({ appointmentId: this._id });
};

// Static method: Get doctor appointments
appointmentSchema.statics.getDoctorAppointments = function (doctorId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    doctorId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ["CANCELLED"] },
  })
    .populate("patientId", "firstName lastName patientId phone")
    .sort({ timeSlot: 1 });
};

// Get today's appointments
appointmentSchema.statics.getTodayAppointments = function (doctorId) {
  return this.getDoctorAppointments(doctorId, new Date());
};

// Get available slots
appointmentSchema.statics.getAvailableSlots = async function (
  doctorId,
  date,
  workingHours = [],
) {
  if (workingHours.length === 0) {
    workingHours = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ];
  }

  const appointments = await this.getDoctorAppointments(doctorId, date);
  const bookedSlots = appointments.map((apt) => apt.timeSlot);

  return workingHours.filter((slot) => !bookedSlots.includes(slot));
};

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
