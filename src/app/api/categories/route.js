import { NextResponse } from "next/server";
import { getCategories } from "@/features/catalog/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(successResponse({ categories }, "Categories loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load categories."), { status: 500 });
  }
}
