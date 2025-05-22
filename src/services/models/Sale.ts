import { ISale } from "@/types/sale";
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema<ISale>(
  {
    product: {
      type: String,
      required: [true, "Please specify the product"],
    },
    quantity: {
      type: Number,
      required: [true, "Please specify the quantity"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Please specify the price"],
      min: [0, "Price cannot be negative"],
    },
    total: {
      type: Number,
      required: [true, "Please specify the total"],
      min: [0, "Total cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: String,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;
