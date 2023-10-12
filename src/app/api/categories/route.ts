import { NextResponse, NextRequest } from "next/server";
import Category from "@/models/category";
import connectMongoDB from "@/libs/mongodb";
import { utapi } from "uploadthing/server";

export async function GET() {
  await connectMongoDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}
export async function POST(request: NextRequest) {
  await connectMongoDB();
  const formData = await request.formData();
  const name = formData.get("name");

  const files = formData.getAll("file");
  const uploadedFiles = await utapi.uploadFiles(files);
  const fileData = uploadedFiles[0].data;
  try {
    if (fileData) {
      const category = await Category.create({ name, image: fileData });
      return NextResponse.json(category);
    }
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

export async function DELETE(request: NextRequest) {
  await connectMongoDB();
  const id = request.nextUrl.searchParams.get("id");
  const key = request.nextUrl.searchParams.get("key");

  try {
    // Check if the ID is valid
    if (!id || !key) {
      throw new Error("Category ID or key is missing.");
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    await utapi.deleteFiles(key);

    if (!deletedCategory) {
      throw new Error("Category not found.");
    }

    return NextResponse.json({ message: "Category was deleted" });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: error.message });
  }
}
