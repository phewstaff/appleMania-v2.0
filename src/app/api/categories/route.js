import { NextResponse } from "next/server";
import Category from "@models/category";
import connectMongoDB from "@libs/mongodb";

export async function GET() {
  await connectMongoDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function DELETE(req) {
  await connectMongoDB();
  const id = req.nextUrl.searchParams.get("id");

  try {
    // Check if the ID is valid
    if (!id) {
      throw new Error("Category ID is missing.");
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw new Error("Category not found.");
    }

    return NextResponse.json({ message: "Category was deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: error.message }, 400);
  }
}
