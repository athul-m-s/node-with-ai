import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All product routes require a valid JWT token
router.use(authenticate);

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
