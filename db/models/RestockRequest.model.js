import mongoose from "mongoose";

const { Schema } = mongoose;

const restockRequestSchema = new Schema(
  {
    drugId: {
      type: Schema.Types.ObjectId,
      ref: "Drug",
      required: [true, "Drug is required"],
    },

    requestedQuantity: {
      type: Number,
      required: [true, "Requested quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED", "FULFILLED"],
        message: "{VALUE} is not a valid status",
      },
      uppercase: true,
      default: "PENDING",
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },

    fulfilledAt: {
      type: Date,
    },

    fulfilledQuantity: {
      type: Number,
      min: 0,
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
restockRequestSchema.index({ drugId: 1, status: 1 });
restockRequestSchema.index({ requestedBy: 1 });
restockRequestSchema.index({ status: 1, createdAt: -1 });

// Instance method: Approve
restockRequestSchema.methods.approve = async function (approvedById) {
  this.status = "APPROVED";
  this.approvedBy = approvedById;
  this.approvedAt = new Date();
  return await this.save();
};

// Reject
restockRequestSchema.methods.reject = async function (approvedById, reason) {
  this.status = "REJECTED";
  this.approvedBy = approvedById;
  this.approvedAt = new Date();
  this.rejectionReason = reason;
  return await this.save();
};

// Fulfill
restockRequestSchema.methods.fulfill = async function (quantity) {
  if (this.status !== "APPROVED") {
    throw new Error("Request must be approved before fulfillment");
  }

  const Drug = mongoose.model("Drug");
  const drug = await Drug.findById(this.drugId);

  if (!drug) {
    throw new Error("Drug not found");
  }

  await drug.addStock(quantity);

  this.status = "FULFILLED";
  this.fulfilledAt = new Date();
  this.fulfilledQuantity = quantity;

  return await this.save();
};

// Static method: Get pending
restockRequestSchema.statics.getPending = function () {
  return this.find({ status: "PENDING" })
    .populate("drugId", "name stockQuantity reorderLevel")
    .populate("requestedBy", "firstName lastName")
    .sort({ createdAt: 1 });
};

const RestockRequest = mongoose.model("RestockRequest", restockRequestSchema);

export default RestockRequest;
