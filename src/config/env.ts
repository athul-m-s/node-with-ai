import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Define schema for required environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().optional().default("3000"),
  MONGODB_URI: z.string().url("MONGODB_URI must be a valid connection string"),
  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET must be at least 10 characters long"),
  JWT_EXPIRES_IN: z.string().optional().default("7d"),
});

export const validateEnv = () => {
  try {
    envSchema.parse(process.env);
    console.log("Environment variables validated successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
    } else {
      console.error("Unexpected error during environment validation:", error);
    }
    process.exit(1);
  }
};
