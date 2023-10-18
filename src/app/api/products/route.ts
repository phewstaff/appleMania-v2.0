import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/product";
import connectMongoDB from "@/libs/mongodb";
import { utapi } from "uploadthing/server";

export async function DELETE(req: NextRequest) {
  await connectMongoDB();
  const id = req.nextUrl.searchParams.get("id");
  const key = req.nextUrl.searchParams.get("key");

  try {
    // Check if the ID is valid
    if (!id || !key) {
      throw new Error("Product ID or key is missing.");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    await utapi.deleteFiles(key);

    if (!deletedProduct) {
      throw new Error("Product not found.");
    }

    return NextResponse.json({ message: "Product was deleted" });
  } catch (error: any) {
    console.error("Error deleting Product:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
