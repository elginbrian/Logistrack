"use client";
import React from "react";
import { useState } from "react";

type ProductData = {
  name: string;
  stock: number;
  maxStock?: number;
};

type ProductStockCardProps = {
  title?: string;
  products?: ProductData[];
};

const CardProductStock = ({
  title = "Product Stock Levels",
  products = [
    { name: "Beras", stock: 80 },
    { name: "Minyak Goreng", stock: 100 },
    { name: "Gula Pasir", stock: 130 },
    { name: "Telur Ayam", stock: 110 },
    { name: "Mie Instan", stock: 105 },
    { name: "Sabun Mandi", stock: 95 },
    { name: "Susu Kental", stock: 70 },
    { name: "Tepung Terigu", stock: 80 },
    { name: "Air Mineral", stock: 90 },
  ],
}: ProductStockCardProps) => {
  const [maxValue, setMaxValue] = useState(200);

  // Calculate the maximum width for the progress bars
  const calculateWidth = (value: number) => {
    return (value / maxValue) * 100;
  };

  // Function to determine color based on stock level
  const getBarColor = (stock: number) => {
    if (stock < 50) return "bg-red-500";
    if (stock < 100) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center">
            <div className="w-28 text-right mr-4 font-medium text-gray-700 text-sm">{product.name}</div>
            <div className="flex-1 relative h-7 bg-gray-100 rounded-md overflow-hidden">
              <div className={`absolute top-0 left-0 h-7 ${getBarColor(product.stock)} rounded-md transition-all duration-500`} style={{ width: `${calculateWidth(product.stock)}%` }}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-700 w-12 text-right">{product.stock}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex border-t pt-4">
        {[0, 50, 100, 150, 200].map((value, index) => (
          <div key={index} className="flex-1 text-xs text-gray-500 text-center">
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProductStock;
