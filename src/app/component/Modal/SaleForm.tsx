"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { ISale } from "@/types/sale";

interface SaleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Partial<ISale>) => void;
  productOptions: string[];
  isSubmitting: boolean;
}

const SaleForm = ({ isOpen, onClose, onSubmit, productOptions, isSubmitting }: SaleFormProps) => {
  const [sale, setSale] = useState<Partial<ISale>>({
    product: "",
    quantity: 1,
    price: 0,
    customer: "",
    status: "completed",
  });

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSale({
        product: "",
        quantity: 1,
        price: 0,
        customer: "",
        status: "completed",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const calculatedTotal = (sale.quantity || 0) * (sale.price || 0);
    setTotal(calculatedTotal);
  }, [sale.quantity, sale.price]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSale((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...sale,
      total,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Sale">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select name="product" value={sale.product} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select a product</option>
            {productOptions.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input type="number" name="quantity" value={sale.quantity} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
          <div className="relative">
            <span className="absolute left-3 top-2">Rp</span>
            <input type="number" name="price" value={sale.price} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2">Rp</span>
            <input type="text" value={total.toLocaleString("id-ID")} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none" readOnly />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer (Optional)</label>
          <input type="text" name="customer" value={sale.customer} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Customer name" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={sale.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
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

export default SaleForm;
