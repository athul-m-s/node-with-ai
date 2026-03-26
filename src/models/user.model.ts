import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
  failedLoginAttempts: number;
  lockUntil?: Date | null;
  isLocked: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    failedLoginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Hash password before saving (Mongoose v7+ async pre-hook, no next callback needed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare plain password with hashed
userSchema.methods["comparePassword"] = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export const User = mongoose.model<IUser>("User", userSchema);
