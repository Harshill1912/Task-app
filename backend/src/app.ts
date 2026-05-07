import cors from "cors";
import express from "express";
import path from "path";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use((_req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) {
      res.status(504).json({
        message: "Request timed out. Please check the database connection."
      });
    }
  });
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
