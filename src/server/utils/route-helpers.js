import { NextResponse } from "next/server";
import { errorResponse } from "@/server/utils/api-response";

/** Maps thrown errors (HttpError, guard errors, unexpected) to the standard JSON envelope. */
export function handleRouteError(error, fallback = "Something went wrong.") {
  if (error?.message === "Unauthorized") return NextResponse.json(errorResponse("Please sign in."), { status: 401 });
  if (error?.message === "Forbidden") return NextResponse.json(errorResponse("You do not have access to this."), { status: 403 });
  if (error?.status) return NextResponse.json(errorResponse(error.message, error.errors || []), { status: error.status });
  console.error(error);
  return NextResponse.json(errorResponse(fallback), { status: 500 });
}
