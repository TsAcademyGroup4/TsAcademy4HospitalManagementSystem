import mongoose from "mongoose";

const { Schema } = mongoose;

const wardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ward name is required'],
      trim: true,
      unique: true
    },

    wardType: {
      type: String,
      required: [true, 'Ward type is required'],
      enum: {
        values: ['GENERAL', 'PRIVATE', 'ICU', 'EMERGENCY', 'PEDIATRIC', 'MATERNITY'],
        message: '{VALUE} is not a valid ward type'
      },
      uppercase: true
    },

    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },

    floor: {
      type: Number,
      min: 0
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
wardSchema.index({ wardType: 1 });


// Virtual: occupied beds
wardSchema.virtual('occupiedBeds', {
  ref: 'Bed',
  localField: '_id',
  foreignField: 'wardId',
  count: true,
  match: { status: 'OCCUPIED' }
});

// Instance method: Get available beds count 
wardSchema.methods.getAvailableBedsCount = async function() {
  const Bed = mongoose.model('Bed');
  return await Bed.countDocuments({
    wardId: this._id,
    status: 'AVAILABLE'
  });
};

// Get all beds
wardSchema.methods.getBeds = async function () {
  const Bed = mongoose.model("Bed");
  return await Bed.find({ wardId: this._id }).sort({ bedNumber: 1 });
};

const Ward = mongoose.model('Ward', wardSchema);

export default Ward;