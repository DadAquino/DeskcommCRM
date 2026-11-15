import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Original Server Actions are never executed by the public visual demo.
  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.json(
      {
        error: {
          code: "visual_demo",
          message: "Demonstração visual: nenhuma alteração é enviada ao servidor.",
        },
      },
      { status: 403 },
    );
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
