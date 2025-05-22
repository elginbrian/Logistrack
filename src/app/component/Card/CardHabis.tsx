"use client";
import React from "react";
import { XCircle } from "lucide-react";

interface CardHabisProps {
  stockOut?: string;
}

const CardHabis = ({ stockOut = "0" }: CardHabisProps) => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-red-200 hover:shadow-md transition-shadow">
      <div className="bg-red-200 text-red-700 p-3 rounded-lg">
        <XCircle size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-red-600 mb-1">Low Stock Items</p>
        <h2 className="text-2xl font-bold text-gray-800">{stockOut}</h2>
      </div>
    </div>
  );
};

export default CardHabis;
