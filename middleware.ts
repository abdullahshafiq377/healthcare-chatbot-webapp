import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // ✅ Using jose for JWT verification
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const protectedRoutes = ["/admin", "/chat", "/profile"];
const adminOnlyRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("Token: ", token);

  const url = new URL(req.url);
  const pathname = url.pathname;

  // Extract locale from pathname (e.g., "/en/chat" → "en")
  const localeMatch = pathname.match(/^\/(en|es|fr|de)/);
  const locale = localeMatch ? localeMatch[1] : "en"; // Default to English

  // Adjust protected and admin routes for all locales
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`),
  );
  const isAdminRoute = adminOnlyRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`),
  );

  // Handle Internationalization Middleware
  const intlMiddleware = createMiddleware(routing);
  let response = intlMiddleware(req); // Preserve existing response

  // Allow access to public routes
  if (!isProtectedRoute) {
    console.log("Not a protected route");

    return response;
  }

  if (!token) {
    console.log("No token found, redirecting...");

    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }

  try {
    // Decode JWT using jose
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // If the route is admin-only, check user role
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return response; // Use the preserved intl response
  } catch (error) {
    console.log("Token verification failed, redirecting...", error);

    // Create a new response instead of modifying `intlResponse`
    const redirectResponse = NextResponse.redirect(
      new URL(`/${locale}/sign-in`, req.url),
    );
    // redirectResponse.cookies.delete("token"); // Clear invalid token

    return redirectResponse;
  }
}

// Apply middleware to all localized routes
export const config = {
  matcher: ["/(en|es|fr|de)/:path*"], // Adjust based on supported locales
};
