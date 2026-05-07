export interface Task {
  _id: string;
  title: string;
  description?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  completed: boolean;
  createdAt: string;
}
