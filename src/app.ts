import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import { validateEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

// Load environment variables
dotenv.config();

// Validate environment variables before proceeding
validateEnv();

const app = express();

// Trust reverse proxy for rate limiting (e.g., Azure App Service, Nginx)
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://kind-pebble-077b9e310.2.azurestaticapps.net", // Production frontend
      "http://localhost:4200", // Angular local dev
      // "http://localhost:3000", // React/Next local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
// We invoke sanitize manually because express-mongo-sanitize attempts to re-assign req.query, which throws an error in Express 5+
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Prevent HTTP Parameter Pollution
app.use(hpp());

// HTTP request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Global rate limiter: 100 requests per 15 min per IP
app.use(apiRateLimiter);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node with AI CRUD API! UPDATED" });
});

// Routes
app.use("/api/auth", authRoutes); // Public: register & login
app.use("/api/users", userRoutes); // Protected: JWT required
app.use("/api/products", productRoutes); // Protected: JWT required

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
