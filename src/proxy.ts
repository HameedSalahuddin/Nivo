import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

const PROTECTED_PATHS = ["/budgets", "/expenses", "/settings"];
const AUTH_PATHS = ["/welcome", "/login", "/signup"];

function needsAuth(pathname: string): boolean {
  return (
    pathname === "/" ||
    PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseEnv();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && needsAuth(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/welcome";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && AUTH_PATHS.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export default async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Match everything except static assets, images, and favicons.
    "/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};