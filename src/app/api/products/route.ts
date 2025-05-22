import Product from "@/services/models/Product";
import StockMovement from "@/services/models/StockMovement";
import connectToDatabase from "@/services/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get search query params if they exist
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let query = {};
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }],
      };
    }

    const products = await Product.find(query).sort({ lastUpdated: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, stock, unit, category } = body;

    // Validation
    if (!name || stock === undefined || !unit || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      stock,
      unit,
      category,
      lastUpdated: new Date(),
    });

    // Create initial stock movement record
    if (stock > 0) {
      await StockMovement.create({
        product: name,
        type: "in",
        quantity: stock,
        date: new Date(),
        note: "Initial stock",
      });
    }

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { _id, name, stock, unit, category } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(_id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Update product
    product.name = name || product.name;
    product.unit = unit || product.unit;
    product.category = category || product.category;

    if (stock !== undefined && stock !== product.stock) {
      // Create stock movement for the difference
      const stockDifference = stock - product.stock;
      if (stockDifference !== 0) {
        await StockMovement.create({
          product: product.name,
          type: stockDifference > 0 ? "in" : "out",
          quantity: Math.abs(stockDifference),
          date: new Date(),
          note: "Stock adjustment",
        });
      }
      product.stock = stock;
    }

    product.lastUpdated = new Date();
    await product.save();

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
