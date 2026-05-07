import { api } from "./client";
import { Task } from "../types/task";

export type TaskAttachment = Pick<
  Task,
  "attachmentUrl" | "attachmentName" | "attachmentType"
>;

export const getTasks = async () => {
  const response = await api.get<Task[]>("/tasks");
  return response.data;
};

export const createTask = async (data: {
  title: string;
  description?: string;
} & TaskAttachment) => {
  const response = await api.post<Task>("/tasks", data);
  return response.data;
};

export const uploadAttachment = async (file: {
  uri: string;
  name: string;
  mimeType?: string | null;
}) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || "application/octet-stream"
  } as unknown as Blob);

  const response = await api.post<TaskAttachment>("/tasks/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<
    Pick<
      Task,
      | "title"
      | "description"
      | "attachmentUrl"
      | "attachmentName"
      | "attachmentType"
      | "completed"
    >
  >
) => {
  const response = await api.patch<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
