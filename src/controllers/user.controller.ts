import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params["id"] as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(
      req.params["id"] as string,
      req.body,
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params["id"] as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
