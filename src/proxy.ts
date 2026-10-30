import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Important: return undefined (not a Response) to continue the request
  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};