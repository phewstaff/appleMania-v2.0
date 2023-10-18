import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/product";
import connectMongoDB from "@/libs/mongodb";

export async function GET(req: NextRequest) {
  await connectMongoDB();
  const id = req.nextUrl.searchParams.get("id");
  try {
    const products = await Product.find({ categoryId: id });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not find products" },
      { status: 400 },
    );
  }
}
