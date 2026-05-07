import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { Task } from "../models/Task";

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  return res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    completed,
    attachmentUrl,
    attachmentName,
    attachmentType
  } = req.body;

  const task = await Task.create({
    title,
    description,
    attachmentUrl,
    attachmentName,
    attachmentType,
    completed,
    user: req.userId
  });

  return res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const updates: {
    title?: string;
    description?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
    completed?: boolean;
  } = {};

  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.attachmentUrl !== undefined) updates.attachmentUrl = req.body.attachmentUrl;
  if (req.body.attachmentName !== undefined) updates.attachmentName = req.body.attachmentName;
  if (req.body.attachmentType !== undefined) updates.attachmentType = req.body.attachmentType;
  if (req.body.completed !== undefined) updates.completed = req.body.completed;

  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(204).send();
};

export const uploadTaskAttachment = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  return res.status(201).json({
    attachmentUrl: `/uploads/${req.file.filename}`,
    attachmentName: req.file.originalname,
    attachmentType: req.file.mimetype
  });
};
