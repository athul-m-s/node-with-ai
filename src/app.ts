import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

// Load environment variables
dotenv.config();

const app = express();
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node with AI CRUD API! UPDATED" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  },
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
