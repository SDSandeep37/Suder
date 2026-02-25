import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // protect dashboard and subroutes
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const sessionAuth = await auth();
    if (!sessionAuth.userId) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
  }

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"], // apply to all routes except static files
};