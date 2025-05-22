"use client";
import React, { useState, useEffect } from "react";
import CardProductStock from "../component/Card/CardProductStock";
import CardStock from "../component/Card/CardStock";
import { Boxes, Search, Plus, ArrowUpDown, RefreshCw, AlertCircle } from "lucide-react";
import LoadingSpinner from "../component/LoadingSpinner";
import ProductForm from "../component/Modal/ProductForm";
import StockMovementForm from "../component/Modal/StockMovementForm";
import { IProduct } from "@/types/product";
import { IStockMovement } from "@/types/stock_movement";

const Stock = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Stock movement form state
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  // Data states
  const [products, setProducts] = useState<IProduct[]>([]);
  const [movements, setMovements] = useState<IStockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter data based on search query
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredMovements = movements.filter((movement) => movement.product.toLowerCase().includes(searchQuery.toLowerCase()) || movement.note?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalStock = products.reduce((sum, item) => sum + item.stock, 0);

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Fetch products
      const productsRes = await fetch("/api/products");
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const productsData = await productsRes.json();

      // Fetch movements
      const movementsRes = await fetch("/api/stock-movements");
      if (!movementsRes.ok) throw new Error("Failed to fetch stock movements");
      const movementsData = await movementsRes.json();

      setProducts(productsData.data || []);
      setMovements(movementsData.data || []);
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

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddMovement = (productName?: string) => {
    setSelectedProduct(productName);
    setShowMovementForm(true);
  };

  const handleProductSubmit = async (product: Partial<IProduct>) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const url = "/api/products";
      const method = product._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      setShowProductForm(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting product:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovementSubmit = async (movement: Partial<IStockMovement>) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await fetch("/api/stock-movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movement),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create stock movement");
      }

      setShowMovementForm(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting movement:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      setApiError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="flex flex-col px-10 py-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your inventory levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <CardStock totalStock={totalStock.toString()} />
        </div>
        <div className="lg:col-span-3">
          <CardProductStock title="Current Stock Levels" products={products.map((p) => ({ name: p.name, stock: p.stock }))} />
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{apiError}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div className="flex gap-2 mb-4 lg:mb-0">
            <button onClick={() => setActiveTab("products")} className={`px-4 py-2 font-medium rounded-md transition-colors focus:outline-none ${activeTab === "products" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
              Products
            </button>
            <button
              onClick={() => setActiveTab("movements")}
              className={`px-4 py-2 font-medium rounded-md transition-colors focus:outline-none ${activeTab === "movements" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Stock Movements
            </button>
            <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors focus:outline-none" title="Refresh">
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : activeTab === "products" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      Stock <ArrowUpDown size={16} className="cursor-pointer" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Last Updated</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                          <Boxes className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock < 50 ? "bg-red-100 text-red-800" : product.stock < 100 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.unit}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(product.lastUpdated).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProduct(product)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button onClick={() => handleAddMovement(product.name)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                          Move
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id!)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement) => (
                  <tr key={movement._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{movement.product}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${movement.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{movement.type === "in" ? "Stock In" : "Stock Out"}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{movement.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(movement.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{movement.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length === 0 && activeTab === "products" && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found. Try a different search term.</p>
          </div>
        )}

        {filteredMovements.length === 0 && activeTab === "movements" && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No stock movements found. Try a different search term.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {activeTab === "products" ? filteredProducts.length : filteredMovements.length} of {activeTab === "products" ? products.length : movements.length} items
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Previous</button>
            <button className="px-3 py-1 rounded bg-blue-100 text-blue-600">1</button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Next</button>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm isOpen={showProductForm} onClose={() => setShowProductForm(false)} onSubmit={handleProductSubmit} initialData={editingProduct || undefined} isSubmitting={isSubmitting} />

      {/* Stock Movement Form Modal */}
      <StockMovementForm isOpen={showMovementForm} onClose={() => setShowMovementForm(false)} onSubmit={handleMovementSubmit} productOptions={products.map((p) => p.name) || []} isSubmitting={isSubmitting} initialProduct={selectedProduct} />
    </div>
  );
};

export default Stock;
