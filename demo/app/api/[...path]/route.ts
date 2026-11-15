import { NextResponse, type NextRequest } from "next/server";
import { demoResponse, demoWriteError } from "../../../lib/responses";

export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  const result = demoResponse(request.nextUrl);
  return NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store" },
  });
}
function disabled() {
  return NextResponse.json(demoWriteError, { status: 403 });
}
export { disabled as POST, disabled as PATCH, disabled as PUT, disabled as DELETE };
