import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  completed: boolean;
  user: Types.ObjectId;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    attachmentUrl: {
      type: String,
      trim: true
    },
    attachmentName: {
      type: String,
      trim: true
    },
    attachmentType: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
