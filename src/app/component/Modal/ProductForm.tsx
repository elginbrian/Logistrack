"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { IProduct } from "@/types/product";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<IProduct>) => void;
  initialData?: Partial<IProduct>;
  isSubmitting: boolean;
}

const ProductForm = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ProductFormProps) => {
  const [product, setProduct] = useState<Partial<IProduct>>({
    name: "",
    stock: 0,
    unit: "",
    category: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setProduct({ ...initialData });
      } else {
        setProduct({ name: "", stock: 0, unit: "", category: "" });
      }
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?._id ? "Edit Product" : "Add New Product"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="kg, pcs, box, etc."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input type="text" name="category" value={product.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none flex items-center justify-center min-w-[80px]" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : initialData?._id ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
