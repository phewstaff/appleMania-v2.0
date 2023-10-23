import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/product";
import connectMongoDB from "@/libs/mongodb";

export async function GET(req: NextRequest) {
  await connectMongoDB();
  console.log("going here");
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  try {
    const products = await Product.find(categoryId);

    if (!products[0]) {
      throw new Error("No products found");
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not find products" },
      { status: 400 },
    );
  }
}
