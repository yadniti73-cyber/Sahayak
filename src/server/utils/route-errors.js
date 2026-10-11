import { NextResponse } from "next/server";
import { errorResponse } from "@/server/utils/api-response";
import { toHttpError } from "@/features/mentor-verification/server/service";

/** Turns anything thrown inside a mentor-verification route into a JSON error response. */
export function verificationErrorResponse(error) {
  const { status, message, errors } = toHttpError(error);
  return NextResponse.json(errorResponse(message, errors), { status, headers: { "Cache-Control": "no-store" } });
}
