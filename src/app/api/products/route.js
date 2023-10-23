import { NextResponse } from "next/server";
import Product from "@/models/product";
import connectMongoDB from "@/libs/mongodb";
import { utapi } from "uploadthing/server";

export async function GET() {
  await connectMongoDB();

  try {
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {}
}

export async function DELETE(req) {
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
  } catch (error) {
    console.error("Error deleting Product:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await connectMongoDB();
  const formData = await req.formData();
  const name = formData.get("name");
  const price = formData.get("price");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");
  const image = JSON.parse(formData.get("image"));

  const body = { name, price, description, categoryId, image };
  console.log(body);
  console.log(image);

  if (!body) {
    throw new Error("Request body is empty");
  }

  try {
    const product = Product.create({ ...body, image });
    return NextResponse.json("Product successfully added");
  } catch (error) {}
}
