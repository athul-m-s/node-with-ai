import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
