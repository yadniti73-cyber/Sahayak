import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/features/auth/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await requestPasswordReset(payload);
    return NextResponse.json(successResponse({ tokenHint: Boolean(result.resetToken) }, result.message));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to request password reset."), { status: 400 });
  }
}
