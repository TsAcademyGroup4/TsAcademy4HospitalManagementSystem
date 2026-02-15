import mongoose from "mongoose";

const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    action: {
      type: String,
      required: [true, "Action is required"],
      uppercase: true,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "VIEW"],
    },

    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      trim: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, "Entity ID is required"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    oldValue: {
      type: Schema.Types.Mixed,
    },

    newValue: {
      type: Schema.Types.Mixed,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      default: "SUCCESS",
      uppercase: true,
    },

    errorMessage: {
      type: String,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });

// Static method: Log
auditLogSchema.statics.log = function (data) {
  return this.create({
    userId: data.userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    description: data.description,
    oldValue: data.oldValue,
    newValue: data.newValue,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    status: data.status || "SUCCESS",
    errorMessage: data.errorMessage,
    timestamp: new Date(),
  });
};

// Get user logs
auditLogSchema.statics.getUserLogs = function (userId, limit = 100) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("userId", "firstName lastName email role");
};

// Get entity logs
auditLogSchema.statics.getEntityLogs = function (entityType, entityId) {
  return this.find({ entityType, entityId })
    .sort({ timestamp: -1 })
    .populate("userId", "firstName lastName email role");
};

// Get by action
auditLogSchema.statics.getByAction = function (action, startDate, endDate) {
  const query = { action };

  if (startDate && endDate) {
    query.timestamp = { $gte: startDate, $lte: endDate };
  }

  return this.find(query)
    .sort({ timestamp: -1 })
    .populate("userId", "firstName lastName email role");
};

// Get failures
auditLogSchema.statics.getFailures = function (startDate, endDate) {
  const query = { status: "FAILURE" };

  if (startDate && endDate) {
    query.timestamp = { $gte: startDate, $lte: endDate };
  }

  return this.find(query)
    .sort({ timestamp: -1 })
    .populate("userId", "firstName lastName email role");
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
