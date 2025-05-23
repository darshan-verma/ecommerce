import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = await getToken({ req: request });

	// List of protected routes that require authentication
	const protectedRoutes = [
		"/account",
		"/account/orders",
		"/account/settings",
		"/checkout",
	];

	// Check if the current path is protected
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	// If it's a protected route and user is not authenticated, redirect to sign-in
	if (isProtectedRoute && !token) {
		const signInUrl = new URL("/auth/signin", request.url);
		signInUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(signInUrl);
	}
	// If user is already authenticated and tries to access sign-in/sign-up pages, redirect to home
	const authRoutes = ["/auth/signin", "/auth/signup"];
	if (authRoutes.includes(pathname) && token) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

// Configure which paths the middleware will run for
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
