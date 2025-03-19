import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path.startsWith("/auth") || path === "/"

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

