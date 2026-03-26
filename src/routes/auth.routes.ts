import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

// Apply rate limiter to all auth routes
router.use(authRateLimiter);

// POST /api/auth/register  → validate body → register handler
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login     → validate body → login handler
router.post("/login", validate(loginSchema), login);

export default router;
