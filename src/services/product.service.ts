import { Product, IProduct } from "../models/product.model.js";

export class ProductService {
  async createProduct(productData: Partial<IProduct>) {
    const product = new Product(productData);
    return await product.save();
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id: string) {
    return await Product.findById(id);
  }

  async updateProduct(id: string, productData: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id);
  }
}
