// ════════════════════════════════════════════════════════════
// Middleware — s'exécute avant chaque requête
// 1. Rafraîchit la session Supabase (cookies)
// 2. Protège /dashboard/* — redirige vers /login si non connecté
// ════════════════════════════════════════════════════════════
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/login", "/signup"].includes(request.nextUrl.pathname);

  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
