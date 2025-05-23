import Product from "@/services/models/Product";
import StockMovement from "@/services/models/StockMovement";
import connectToDatabase from "@/services/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let query = {};
    if (search) {
      query = {
        $or: [{ product: { $regex: search, $options: "i" } }, { note: { $regex: search, $options: "i" } }],
      };
    }

    const movements = await StockMovement.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: movements });
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stock movements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { product, type, quantity, note } = body;

    if (!product || !type || !quantity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const productDoc = await Product.findOne({ name: product });
    if (!productDoc) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const newMovement = await StockMovement.create({
      product,
      type,
      quantity,
      note,
      date: new Date(),
    });

    if (type === "in") {
      productDoc.stock += quantity;
    } else if (type === "out") {
      if (productDoc.stock < quantity) {
        return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
      }
      productDoc.stock -= quantity;
    }

    productDoc.lastUpdated = new Date();
    await productDoc.save();

    return NextResponse.json({ success: true, data: newMovement }, { status: 201 });
  } catch (error) {
    console.error("Error creating stock movement:", error);
    return NextResponse.json({ success: false, error: "Failed to create stock movement" }, { status: 500 });
  }
}

