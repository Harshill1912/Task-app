import { Router } from "express";
import { body } from "express-validator";
import { login, signup } from "../controllers/authController";
import { handleValidation } from "../utils/validation";

const router = Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  handleValidation,
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  handleValidation,
  login
);

export default router;
