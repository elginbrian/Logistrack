"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { IStockMovement } from "@/types/stock_movement";

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movement: Partial<IStockMovement>) => void;
  productOptions: string[];
  isSubmitting: boolean;
  initialProduct?: string;
}

const StockMovementForm = ({ isOpen, onClose, onSubmit, productOptions, isSubmitting, initialProduct }: StockMovementFormProps) => {
  const [movement, setMovement] = useState<Partial<IStockMovement>>({
    product: "",
    type: "in",
    quantity: 1,
    note: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMovement({
        product: initialProduct || "",
        type: "in",
        quantity: 1,
        note: "",
      });
    }
  }, [isOpen, initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovement((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(movement);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Stock Movement">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select name="product" value={movement.product} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!!initialProduct}>
            <option value="">Select a product</option>
            {productOptions.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" name="type" value="in" checked={movement.type === "in"} onChange={handleChange} className="h-4 w-4 text-blue-600" />
              <span className="ml-2">Stock In</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="type" value="out" checked={movement.type === "out"} onChange={handleChange} className="h-4 w-4 text-blue-600" />
              <span className="ml-2">Stock Out</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input type="number" name="quantity" value={movement.quantity} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <textarea
            name="note"
            value={movement.note}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter reason for stock movement"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none flex items-center justify-center min-w-[80px]" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StockMovementForm;
