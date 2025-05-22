"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";

type CardPenjualanProps = {
  totalSales?: string;
};

const CardPenjualan = ({ totalSales = "0" }: CardPenjualanProps) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow">
      <div className="bg-green-200 text-green-700 p-3 rounded-lg">
        <ShoppingCart size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-green-600 mb-1">Total Penjualan</p>
        <h2 className="text-2xl font-bold text-gray-800">{totalSales}</h2>
      </div>
    </div>
  );
};

export default CardPenjualan;
