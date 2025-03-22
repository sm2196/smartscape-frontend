import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path.startsWith("/auth") ||
    path === "/" ||
    path === "/about" ||
    path === "/services" ||
    path === "/contact" ||
    path === "/faq" ||
    path === "/api/send-email"

  // Check for email verification redirect
  const url = new URL(request.url)
  const emailChanged = url.searchParams.get("emailChanged")
  const newEmail = url.searchParams.get("newEmail")
  const isEmailVerification = emailChanged === "true" && newEmail

  // If this is an email verification redirect, allow access to the dashboard
  if (isEmailVerification) {
    return NextResponse.next()
  }

  // Check if the user is authenticated by looking for the auth cookie
  const authCookie = request.cookies.get("auth-session")?.value
  const isAuthenticated = !!authCookie

  // Check if user is a guest user
  const isGuestUser = request.cookies.get("guest-user")?.value === "true"

  // Define admin-only paths
  const isAdminOnlyPath = path === "/dashboard/settings/admin" || path === "/dashboard/settings/roomdevices"

  // If the user is a guest and trying to access admin-only paths, redirect to settings
  if (isAuthenticated && isGuestUser && isAdminOnlyPath) {
    return NextResponse.redirect(new URL("/dashboard/settings", request.url))
  }

  // If the path is protected and the user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Continue with the request for all other cases
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

