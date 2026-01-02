import { NextRequest, NextResponse } from "next/server";
import isAuthenticated from "./lib/auth/isAuthenticated";
import { refreshSession } from "./lib/auth/refreshSession";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  let isProtected: boolean;
  let isAuth: boolean = false;
  const MERGER_ACCESS_TOKEN = req.cookies.get("MERGER_ACCESS_TOKEN")?.value;
  const MERGER_SESSION = req.cookies.get("MERGER_SESSION")?.value;

  console.log("path: ", path);

  //   Check for protectedt routes
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/merger") ||
    path.startsWith("/resetpass")
  ) {
    isProtected = true;
  } else {
    isProtected = false;
  }

  if (MERGER_SESSION) {
    // Verify the session
    isAuth = await isAuthenticated();

    if (!isAuth) {
      console.log("Not Authenticated");

      // Check if session expired
      const isRefreshed = await refreshSession();

      if (isProtected && !isRefreshed) {
        return NextResponse.redirect(new URL("/login", req.url));
      } else {
        console.log(
          "Old access token: ",
          MERGER_ACCESS_TOKEN,
          "Token refreshed - isRefreshed: ",
          isRefreshed
        );
        return NextResponse.next();
      }
    } else {
      console.log("Authenticated");
      if (isProtected) {
        return NextResponse.next();
      } else {
        if (
          path === "/" ||
          path === "/login" ||
          path === "/signup" ||
          path === "/resetpass" ||
          path === "/forget"
        ) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
          return NextResponse.next();
        }
      }
    }
  } else {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/login/:path*",
    "/signup/:path*",
    "/resetpass/:path*",
    "/forgot/:path*",
    "/dashboard/:path*",
    "/merger/:path*",
  ],
};
