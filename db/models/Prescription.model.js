import mongoose from "mongoose";

const { Schema } = mongoose;

const prescriptionSchema = new Schema(
  {
    prescriptionNumber: {
      type: String,
      unique: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    consultationId: {
      type: Schema.Types.ObjectId,
      ref: "Consultation",
    },

    enteredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        drugId: {
          type: Schema.Types.ObjectId,
          ref: "Drug",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        dosage: {
          type: String,
          required: true,
          trim: true,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: {
        values: ["PAID", "AWAITING_PAYMENT", "PARTIALLY_PAID"],
        message: "{VALUE} is not a valid payment status",
      },
      uppercase: true,
      default: "AWAITING_PAYMENT",
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["PENDING", "DISPENSED", "CANCELLED", "PARTIALLY_DISPENSED"],
        message: "{VALUE} is not a valid status",
      },
      uppercase: true,
      default: "PENDING",
    },

    dispensedAt: {
      type: Date,
    },

    dispensedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ paymentStatus: 1 });
prescriptionSchema.index({ status: 1 });

// Virtual: balance due
prescriptionSchema.virtual("balanceDue").get(function () {
  return this.totalAmount - this.amountPaid;
});

// Pre-save: Auto-generate prescription number
prescriptionSchema.pre("save", async function () {
  if (!this.isNew) return;

  const lastPrescription = await this.constructor
    .findOne({}, { prescriptionNumber: 1 })
    .sort({ prescriptionNumber: -1 })
    .lean();

  let nextNumber = 1;
  if (lastPrescription && lastPrescription.prescriptionNumber) {
    const lastNumber = parseInt(
      lastPrescription.prescriptionNumber.split("-")[1],
    );
    nextNumber = lastNumber + 1;
  }

  this.prescriptionNumber = `PRE-${String(nextNumber).padStart(5, "0")}`;
});

// Calculate total
prescriptionSchema.pre("save", function () {
  if (this.isModified("items")) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }
});

// Instance method: Mark paid
prescriptionSchema.methods.markPaid = async function (amount) {
  this.amountPaid += amount;

  if (this.amountPaid >= this.totalAmount) {
    this.paymentStatus = "PAID";
  } else if (this.amountPaid > 0) {
    this.paymentStatus = "PARTIALLY_PAID";
  }

  return await this.save();
};

// Dispense
prescriptionSchema.methods.dispense = async function (userId) {
  if (this.paymentStatus !== "PAID") {
    throw new Error("Prescription must be paid before dispensing");
  }

  const Drug = mongoose.model("Drug");

  for (const item of this.items) {
    const drug = await Drug.findById(item.drugId);
    if (!drug) {
      throw new Error(`Drug not found: ${item.drugId}`);
    }
    await drug.deductStock(item.quantity);
  }

  this.status = "DISPENSED";
  this.dispensedAt = new Date();
  this.dispensedBy = userId;

  return await this.save();
};

// Static method: Get pending
prescriptionSchema.statics.getPending = function () {
  return this.find({
    status: "PENDING",
    paymentStatus: "PAID",
  })
    .populate("patientId", "firstName lastName patientId")
    .sort({ createdAt: 1 });
};

// Get unpaid
prescriptionSchema.statics.getUnpaid = function () {
  return this.find({
    paymentStatus: { $in: ["AWAITING_PAYMENT", "PARTIALLY_PAID"] },
  })
    .populate("patientId", "firstName lastName patientId")
    .sort({ createdAt: -1 });
};

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
