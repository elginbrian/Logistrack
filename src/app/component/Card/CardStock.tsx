"use client";
import React from "react";
import { Boxes } from "lucide-react";

interface CardStockProps {
  totalStock?: string;
}

const CardStock = ({ totalStock = "0" }: CardStockProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
      <div className="bg-blue-200 text-blue-700 p-3 rounded-lg">
        <Boxes size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-blue-600 mb-1">Total Stock</p>
        <h2 className="text-2xl font-bold text-gray-800">{totalStock}</h2>
      </div>
    </div>
  );
};

export default CardStock;
