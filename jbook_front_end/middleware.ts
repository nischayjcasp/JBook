import { NextRequest, NextResponse } from "next/server";
import { ReduxStore } from "./src/redux/store";

export function middleware(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value;
  const sessionId = ReduxStore.getState().session.sessionId;
  let isProtected: boolean;
  const path = req.nextUrl.pathname;

  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/merger") ||
    path.startsWith("/resetpass")
  ) {
    isProtected = true;
  } else {
    isProtected = false;
  }
  if (!access_token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/merger/:path*", "/resetpass/:path*"],
};
