import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/login", "/api/auth"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If accessing public route, allow
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access (support legacy tokens: bendahara->admin, instansi->user)
  let userLevel = token.level as string
  if (userLevel === "admin") userLevel = "admin"
  if (userLevel === "user") userLevel = "user"

  const isAdminRoute = pathname.startsWith("/admin")
  const isUserRoute = pathname.startsWith("/user")

  // Redirect to appropriate dashboard if accessing root
  if (pathname === "/") {
    if (userLevel === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userLevel === "user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    }
  }

  // Check if user has access to the route
  if (isAdminRoute && userLevel !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }
  if (isUserRoute && userLevel !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (static)
     * - favicon.ico, images
     * - /login (allow direct access without middleware)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
