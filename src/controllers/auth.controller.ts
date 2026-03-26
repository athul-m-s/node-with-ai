import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

const authService = new AuthService();

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
): Promise<void> => {
  try {
    // req.body is already validated & sanitized by the validate middleware
    const result = await authService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error: any) {
    const status = error.message?.includes("already registered") ? 409 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
): Promise<void> => {
  try {
    // req.body is already validated & sanitized by the validate middleware
    const result = await authService.login(req.body.email, req.body.password);
    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
