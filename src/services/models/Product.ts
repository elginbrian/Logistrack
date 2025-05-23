import { IProduct } from "@/types/product";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide the stock amount"],
      min: [0, "Stock cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Please provide a unit of measurement"],
      maxlength: [20, "Unit cannot be more than 20 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      maxlength: [30, "Category cannot be more than 30 characters"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

