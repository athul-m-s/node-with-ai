import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  async register(data: {
    name: string;
    email: string;
    age: number;
    password: string;
  }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new Error("Email is already registered");
    }

    // Password is hashed automatically via mongoose pre-save hook
    const user = new User(data);
    await user.save();

    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = this.signToken(userId, user.email);

    return {
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        age: user.age,
      },
    };
  }

  async login(email: string, password: string) {
    // +password because it's select:false in schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = this.signToken(userId, user.email);

    return {
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        age: user.age,
      },
    };
  }

  private signToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }
}
