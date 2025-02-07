import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduleDate: { type: Date, required: true },

    startTime: { type: Date, required: true }, // "08:00"
    endTime: { type: Date, required: true }, // "16:00"

    status: {
      type: String,
      enum: ["scheduled", "changed", "requested_change"],
      default: "scheduled",
    },
    requestChange: {
      reason: { type: String }, // e.g., "Sick leave"
      newStartTime: { type: Date },
      newEndTime: { type: Date },
      requestedAt: { type: Date },
      approved: { type: Boolean, default: false }, // Manager approval
    },
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", ScheduleSchema);
