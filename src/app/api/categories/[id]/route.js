import connectMongoDB from "../../../../../libs/mongodb";
import Category from "../../../../../models/category";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const {
    newName: name,
    newImage: image,
    newImageMin: imageMin,
  } = await req.json();

  await connectMongoDB();

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, {
      name,
      image,
      imageMin,
    });

    return NextResponse.json({ updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Could not update category" }, 400);
  }
}
