import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoutes = createRouteMatcher([
  "/dashboard(.*)", "/api/compression-jobs(.*)",
])
export default clerkMiddleware(async (auth, req) => {
  if(isProtectedRoutes(req)) {
    const { userId } = await auth();

      if (!userId) {
      // Not authenticated → redirect to sign-in page
          return NextResponse.redirect(new URL('/auth/sign-in', req.url));
      }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};