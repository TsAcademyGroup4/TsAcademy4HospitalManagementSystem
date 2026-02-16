import mongoose from "mongoose";

const { Schema } = mongoose;

const drugSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Drug name is required"],
      trim: true,
      unique: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    category: {
      type: String,
      trim: true,
      enum: [
        "ANTIBIOTIC",
        "PAINKILLER",
        "ANTISEPTIC",
        "VITAMIN",
        "INJECTION",
        "OTHER",
      ],
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Price cannot be negative"],
    },

    reorderLevel: {
      type: Number,
      default: 10,
      min: [0, "Reorder level cannot be negative"],
    },

    manufacturer: {
      type: String,
      trim: true,
    },

    batchNumber: {
      type: String,
      trim: true,
    },

    expiryDate: {
      type: Date,
    },

    dosageForm: {
      type: String,
      enum: [
        "TABLET",
        "CAPSULE",
        "SYRUP",
        "INJECTION",
        "OINTMENT",
        "DROPS",
        "OTHER",
      ],
    },

    strength: {
      type: String,
      trim: true,
    },

    requiresPrescription: {
      type: Boolean,
      default: true,
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
drugSchema.index({ stockQuantity: 1 });
drugSchema.index({ category: 1 });
drugSchema.index({ name: "text", genericName: "text" });

// Virtual: is low stock
drugSchema.virtual("isLowStock").get(function () {
  return this.stockQuantity <= this.reorderLevel;
});

// is expired
drugSchema.virtual("isExpired").get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Instance method: Add stock
drugSchema.methods.addStock = async function (quantity) {
  this.stockQuantity += quantity;
  return await this.save();
};

// Deduct stock
drugSchema.methods.deductStock = async function (quantity) {
  if (this.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }
  this.stockQuantity -= quantity;
  return await this.save();
};

// Static method: Get low stock
drugSchema.statics.getLowStock = function () {
  return this.find({
    isActive: true,
    $expr: { $lte: ["$stockQuantity", "$reorderLevel"] },
  }).sort({ stockQuantity: 1 });
};

// Get expired
drugSchema.statics.getExpired = function () {
  return this.find({
    isActive: true,
    expiryDate: { $lt: new Date() },
  });
};

// Search
drugSchema.statics.search = function (searchTerm) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true,
  });
};

const Drug = mongoose.model("Drug", drugSchema);

export default Drug;
