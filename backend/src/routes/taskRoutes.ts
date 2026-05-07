import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import {
  createTask,
  deleteTask,
  getTasks,
  uploadTaskAttachment,
  updateTask
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/auth";
import { handleValidation } from "../utils/validation";

const router = Router();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
      cb(null, `${Date.now()}-${safeName}`);
    }
  })
});

router.use(authMiddleware);

router.get("/", getTasks);

router.post("/upload", upload.single("file"), uploadTaskAttachment);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("attachmentUrl").optional().trim(),
    body("attachmentName").optional().trim(),
    body("attachmentType").optional().trim(),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean")
  ],
  handleValidation,
  createTask
);

router.patch(
  "/:id",
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().trim(),
    body("attachmentUrl").optional().trim(),
    body("attachmentName").optional().trim(),
    body("attachmentType").optional().trim(),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean")
  ],
  handleValidation,
  updateTask
);

router.delete("/:id", deleteTask);

export default router;
