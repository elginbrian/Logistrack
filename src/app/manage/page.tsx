"use client";
import React, { useState, useEffect } from "react";
import CardPenjualan from "../component/Card/CardPenjualan";
import { Calendar, ShoppingCart, Search, DollarSign, TrendingUp, Filter, ChevronDown, RefreshCw, AlertCircle, Plus } from "lucide-react";
import LoadingSpinner from "../component/LoadingSpinner";
import SaleForm from "../component/Modal/SaleForm";
import { ISale } from "@/types/sale";
import { IProduct } from "@/types/product";

const Manage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  // Data states
  const [sales, setSales] = useState<ISale[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Fetch sales
      const salesRes = await fetch("/api/sales");
      if (!salesRes.ok) throw new Error("Failed to fetch sales");
      const salesData = await salesRes.json();

      // Fetch products for the sale form
      const productsRes = await fetch("/api/products");
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const productsData = await productsRes.json();

      setSales(salesData.data || []);
      setProducts(productsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError(error instanceof Error ? error.message : "An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter sales based on search query and filters
  const filteredSales = sales.filter((sale) => {
    // Search filter
    const matchesSearch = sale.product.toLowerCase().includes(searchQuery.toLowerCase()) || sale.customer?.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter - assuming date is stored as ISO string
    const matchesDate = !dateFilter || new Date(sale.date).toLocaleDateString().includes(dateFilter);

    // Status filter
    const matchesStatus = !statusFilter || sale.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Calculate total sales amount
  const calculateTotalSales = () => {
    return sales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, item) => sum + item.total, 0)
      .toLocaleString("id-ID");
  };

  // Get total sales count
  const salesCount = sales.length;

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddSale = () => {
    setShowSaleForm(true);
  };

  const handleSaleSubmit = async (sale: Partial<ISale>) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create sale");
      }

      setShowSaleForm(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting sale:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSaleStatus = async (id: string, newStatus: "completed" | "pending" | "canceled") => {
    try {
      const response = await fetch("/api/sales", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update sale status");
      }

      fetchData();
    } catch (error) {
      console.error("Error updating sale:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sales?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete sale");
      }

      fetchData();
    } catch (error) {
      console.error("Error deleting sale:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  // Render status badges with buttons for changing status
  const renderStatusBadge = (sale: ISale) => {
    const getStatusColorClass = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "canceled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="relative group">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(sale.status)}`}>{sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}</span>

        {/* Dropdown menu for changing status */}
        <div className="hidden group-hover:block absolute left-0 mt-1 bg-white shadow-md rounded-md overflow-hidden z-10 min-w-[120px]">
          {["completed", "pending", "canceled"].map(
            (status) =>
              status !== sale.status && (
                <button key={status} onClick={() => handleUpdateSaleStatus(sale._id!, status as "completed" | "pending" | "canceled")} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors">
                  Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col px-10 py-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
        <p className="text-gray-600 mt-1">Track and analyze your sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <CardPenjualan totalSales={calculateTotalSales()} />

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
          <div className="bg-purple-200 text-purple-700 p-3 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">Total Revenue</p>
            <h2 className="text-2xl font-bold text-gray-800">Rp {calculateTotalSales()}</h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
          <div className="bg-amber-200 text-amber-700 p-3 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-600 mb-1">This Month</p>
            <h2 className="text-2xl font-bold text-gray-800">{salesCount} Sales</h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
          <div className="bg-cyan-200 text-cyan-700 p-3 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-600 mb-1">Growth</p>
            <h2 className="text-2xl font-bold text-gray-800">+12.5%</h2>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{apiError}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div className="flex items-center gap-2 mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">Sales Transactions</h2>
            <button onClick={handleRefresh} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors focus:outline-none" title="Refresh">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            <div className="flex gap-2 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-9 pr-4 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <button onClick={handleAddSale} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus size={18} />
                <span>Add Sale</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center gap-2 hover:bg-gray-200">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <select className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md appearance-none pr-8 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{sale._id?.substring(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                          <ShoppingCart className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">{sale.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sale.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">Rp {sale.price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">Rp {sale.total.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{sale.customer || "-"}</td>
                    <td className="px-4 py-3">{renderStatusBadge(sale)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteSale(sale._id!)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredSales.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sales found. Try a different search term or add a new sale.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {filteredSales.length} of {sales.length} transactions
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Previous</button>
            <button className="px-3 py-1 rounded bg-blue-100 text-blue-600">1</button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Next</button>
          </div>
        </div>
      </div>

      {/* SaleForm Modal */}
      <SaleForm isOpen={showSaleForm} onClose={() => setShowSaleForm(false)} onSubmit={handleSaleSubmit} productOptions={products.map((p) => p.name)} isSubmitting={isSubmitting} />
    </div>
  );
};

export default Manage;
