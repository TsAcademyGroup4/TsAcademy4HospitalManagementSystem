import mongoose from "mongoose";

const { Schema } = mongoose;

const bedSchema = new Schema(
  {
    wardId: {
      type: Schema.Types.ObjectId,
      ref: 'Ward',
      required: [true, 'Ward is required']
    },

    bedNumber: {
      type: String,
      required: [true, 'Bed number is required'],
      trim: true
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ['AVAILABLE', 'OCCUPIED', 'MAINTAINANCE', 'RESERVED'],
        message: '{VALUE} is not a valid bed status'
      },
      uppercase: true,
      default: 'AVAILABLE'
    },

    features: [{
      type: String,
      enum: ['OXYGEN', 'MONITOR', 'ADJUSTABLE', 'SIDE_RAILS']
    }],

    lastMaintenance: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index
bedSchema.index({ wardId: 1, bedNumber: 1 },{ unique: true });
bedSchema.index({ status: 1 });

// Instance method: Get current admission
bedSchema.methods.getCurrentAdmission = async function () {
  if (this.status !== 'OCCUPIED') return null;

  const Admission = mongoose.model('Admission');
  return await Admission.findOne({
    bedId: this._id,
    status: 'ACTIVE'
  }).populate('patientId');
};

// Occupy bed
bedSchema.methods.occupy = async function () {
  this.status = 'OCCUPIED';
  return await this.save();
};

// Make available
bedSchema.methods.makeAvailable = async function () {
  this.status = 'AVAILABLE';
  return await this.save();
};

// Static method: Find avavilabe beds
bedSchema.statics.findAvailable = function(wardId) {
  return this.find({
    wardId,
    status: 'AVAILABLE'
  }).populate('wardId');
};

const Bed = mongoose.model('Bed', bedSchema);

export default Bed;