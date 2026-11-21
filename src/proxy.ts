import { NextResponse, type NextRequest } from "next/server";

/**
 * Old vehicle links (/vehicles/{uuid}) → canonical SEO URL (/vehicles/{slug}) with a
 * real 308 Permanent Redirect, so bookmarks, shared links and indexed pages pass
 * their ranking to the new address. Query params (e.g. ?enquire=price) are kept.
 *
 * Runs only for /vehicles/{segment} and only calls the API when the segment is a
 * bare UUID — slug URLs pass straight through.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

export async function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!UUID_REGEX.test(segment)) return NextResponse.next();

  try {
    const res = await fetch(`${API_URL}/vehicles/${segment}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const { slug } = (await res.json()) as { slug?: string | null };
      if (slug) {
        const target = request.nextUrl.clone();
        target.pathname = `/vehicles/${slug}`;
        return NextResponse.redirect(target, 308);
      }
    }
  } catch {
    // API unreachable — fall through and let the page render its not-found state.
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/vehicles/:segment",
};
