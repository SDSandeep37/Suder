// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)", // protect dashboard and subroutes
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) {
//     const sessionAuth = await auth();
//     if (!sessionAuth.userId) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }
//   }

// });

// export const config = {
//   // matcher: ["/((?!.*\\..*|_next).*)", "/"], // apply to all routes except static files
//   matcher: ["/dashboard/:path*"], // apply only to dashboard routes
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !(await auth()).userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: "/((?!_next|.*\\..*).*)", 
};