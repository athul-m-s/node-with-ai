import { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(
      req.params["id"] as string,
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(
      req.params["id"] as string,
      req.body,
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.deleteProduct(
      req.params["id"] as string,
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
