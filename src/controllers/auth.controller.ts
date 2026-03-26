import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age, password } = req.body;

    if (!name || !email || !age || !password) {
      res.status(400).json({ message: "name, email, age, and password are required" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters" });
      return;
    }

    const result = await authService.register({ name, email, age, password });
    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error: any) {
    const status = error.message?.includes("already registered") ? 409 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const result = await authService.login(email, password);
    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
