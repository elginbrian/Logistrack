import { IStockMovement } from "@/types/stock_movement";
import mongoose from "mongoose";

const StockMovementSchema = new mongoose.Schema<IStockMovement>(
  {
    product: {
      type: String,
      required: [true, "Please specify the product"],
    },
    user: {
      type: String,
    },
    type: {
      type: String,
      enum: ["in", "out"],
      required: [true, "Movement type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    note: {
      type: String,
      maxlength: [200, "Note cannot be more than 200 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StockMovement = mongoose.models.StockMovement || mongoose.model<IStockMovement>("StockMovement", StockMovementSchema);

export default StockMovement;
