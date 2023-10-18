import { NextResponse, NextRequest } from "next/server";
import Category from "@/models/category";
import connectMongoDB from "@/libs/mongodb";
import { utapi } from "uploadthing/server";

export async function POST(req: NextRequest) {
  let uploadedFiles;
  await connectMongoDB();
  const formData = await req.formData();
  const name = formData.get("name");

  const files = formData.getAll("file");

  if (files[0] !== "null") {
    uploadedFiles = await utapi.uploadFiles(files);
  }

  const fileData = uploadedFiles ? uploadedFiles[0].data : null;
  try {
    if (fileData && name) {
      const category = await Category.create({ name, image: fileData });
      return NextResponse.json(category);
    }
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

export async function DELETE(req: NextRequest) {
  await connectMongoDB();
  const id = req.nextUrl.searchParams.get("id");
  const key = req.nextUrl.searchParams.get("key");

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

export async function GET() {
  await connectMongoDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function PUT(req: NextRequest) {
  let uploadedFiles;
  await connectMongoDB();
  const formData = await req.formData();

  const name = formData.get("name");
  const files = formData.getAll("file");

  const id = req.nextUrl.searchParams.get("currentCategoryId");
  const key = req.nextUrl.searchParams.get("key");

  console.log(key);

  if (files[0] != "null") {
    console.log("it happens", files[0]);
    uploadedFiles = await utapi.uploadFiles(files);
    if (key) await utapi.deleteFiles(key);
  }

  const fileData = uploadedFiles ? uploadedFiles[0].data : null;
  console.log("first");

  try {
    console.log("second");
    if (!id) {
      throw new Error("Id or key is missing");
    }

    const currentCategory = await Category.find({ _id: id });
    console.log("current category", currentCategory);

    const editedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name ? name : currentCategory.name,
        image: fileData ? fileData : currentCategory.image,
      },
      { new: true },
    );

    return NextResponse.json(editedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Could not update category" },
      { status: 400 },
    );
  }
}
