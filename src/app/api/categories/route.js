import connnectMongoDB from "../../../../libs/mongodb";
import Category from "../../../../models/category";
import { NextResponse } from "next/server";

export async function GET() {
  await connnectMongoDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}
