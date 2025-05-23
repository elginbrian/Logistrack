import Product from "@/services/models/Product";
import Sale from "@/services/models/Sale";
import StockMovement from "@/services/models/StockMovement";
import connectToDatabase from "@/services/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    let query: any = {};

    if (search) {
      query.$or = [{ product: { $regex: search, $options: "i" } }, { customer: { $regex: search, $options: "i" } }];
    }

    if (status) {
      query.status = status;
    }

    const sales = await Sale.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { product, quantity, price, customer, status } = body;

    if (!product || !quantity || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const total = quantity * price;

    const newSale = await Sale.create({
      product,
      quantity,
      price,
      total,
      customer,
      status: status || "completed",
      date: new Date(),
    });

    if (newSale.status === "completed") {
      const productDoc = await Product.findOne({ name: product });
      if (productDoc) {
        if (productDoc.stock < quantity) {
          return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
        }

        productDoc.stock -= quantity;
        productDoc.lastUpdated = new Date();
        await productDoc.save();

        await StockMovement.create({
          product,
          type: "out",
          quantity,
          note: "Sale",
          date: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true, data: newSale }, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json({ success: false, error: "Failed to create sale" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { _id, status } = body;

    if (!_id || !status) {
      return NextResponse.json({ success: false, error: "Sale ID and status are required" }, { status: 400 });
    }

    const sale = await Sale.findById(_id);
    if (!sale) {
      return NextResponse.json({ success: false, error: "Sale not found" }, { status: 404 });
    }

    const oldStatus = sale.status;
    sale.status = status;
    await sale.save();

    if (oldStatus !== "completed" && status === "completed") {
      const productDoc = await Product.findOne({ name: sale.product });
      if (productDoc) {
        if (productDoc.stock < sale.quantity) {
          return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
        }

        productDoc.stock -= sale.quantity;
        productDoc.lastUpdated = new Date();
        await productDoc.save();

        await StockMovement.create({
          product: sale.product,
          type: "out",
          quantity: sale.quantity,
          note: "Sale completed",
          date: new Date(),
        });
      }
    } else if (oldStatus === "completed" && status !== "completed") {
      const productDoc = await Product.findOne({ name: sale.product });
      if (productDoc) {
        productDoc.stock += sale.quantity;
        productDoc.lastUpdated = new Date();
        await productDoc.save();

        await StockMovement.create({
          product: sale.product,
          type: "in",
          quantity: sale.quantity,
          note: `Sale ${status}`,
          date: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json({ success: false, error: "Failed to update sale" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Sale ID is required" }, { status: 400 });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return NextResponse.json({ success: false, error: "Sale not found" }, { status: 404 });
    }

    if (sale.status === "completed") {
      const productDoc = await Product.findOne({ name: sale.product });
      if (productDoc) {
        productDoc.stock += sale.quantity;
        productDoc.lastUpdated = new Date();
        await productDoc.save();

        await StockMovement.create({
          product: sale.product,
          type: "in",
          quantity: sale.quantity,
          note: "Sale deleted",
          date: new Date(),
        });
      }
    }

    await Sale.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json({ success: false, error: "Failed to delete sale" }, { status: 500 });
  }
}

