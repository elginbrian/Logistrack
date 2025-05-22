"use client";
import React, { useEffect, useState } from "react";
import CardPenjualan from "@/app/component/Card/CardPenjualan";
import CardStock from "@/app/component/Card/CardStock";
import CardHabis from "@/app/component/Card/CardHabis";
import CardProductStock from "./component/Card/CardProductStock";
import CardDashboard from "./component/Card/CardDashboard";
import LoadingSpinner from "./component/LoadingSpinner";
import { IProduct } from "@/types/product";
import { ISale } from "@/types/sale";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sales, setSales] = useState<ISale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const productsData = await productsRes.json();

        // Fetch sales
        const salesRes = await fetch("/api/sales");
        if (!salesRes.ok) throw new Error("Failed to fetch sales");
        const salesData = await salesRes.json();

        setProducts(productsData.data || []);
        setSales(salesData.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total sales amount
  const calculateTotalSales = () => {
    return sales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, item) => sum + item.total, 0)
      .toLocaleString("id-ID");
  };

  // Calculate total stock
  const calculateTotalStock = () => {
    return products.reduce((sum, item) => sum + item.stock, 0).toString();
  };

  // Calculate low stock count (items with stock less than 50)
  const calculateLowStock = () => {
    return products.filter((item) => item.stock < 50).length.toString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col px-10 py-6 h-full items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 mt-4">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col px-10 py-6 h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-10 py-6 h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to LogisTrack inventory management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardPenjualan totalSales={calculateTotalSales()} />
        <CardStock totalStock={calculateTotalStock()} />
        <CardHabis stockOut={calculateLowStock()} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Status</h2>
        <CardProductStock title="Current Stock Levels" products={products.map((p) => ({ name: p.name, stock: p.stock }))} />
      </div>
    </div>
  );
};

export default Home;
