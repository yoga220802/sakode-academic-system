import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "admin" | "mentor" | "mentor_lead" | "murid" | "school_principal" | "referrer";

interface RouteRule {
  path: string;
  roles: UserRole[];
}

const ROUTE_RULES: RouteRule[] = [
  // Admin-only routes
  { path: "/registration-review", roles: ["admin"] },
  { path: "/students", roles: ["admin"] },
  { path: "/programs", roles: ["admin"] },
  { path: "/trials", roles: ["admin"] },
  { path: "/users", roles: ["admin"] },
  { path: "/mentors", roles: ["admin"] },
  { path: "/plotting", roles: ["admin"] },
  { path: "/schedules-admin", roles: ["admin"] },
  { path: "/extracurriculars-admin", roles: ["admin"] },
  { path: "/principal-membership", roles: ["admin"] },
  { path: "/logs", roles: ["admin"] },
  { path: "/referrals/accounts", roles: ["admin"] },

  // Mentor & Mentor Lead shared routes
  { path: "/my-students", roles: ["mentor", "mentor_lead"] },
  { path: "/grading", roles: ["mentor", "mentor_lead"] },

  // Mentor Lead specific
  { path: "/plotting-queue", roles: ["mentor_lead"] },
  { path: "/schedules-lead", roles: ["mentor_lead"] },
  { path: "/lead-overview", roles: ["mentor_lead"] },

  // Mentor specific
  { path: "/schedules", roles: ["mentor"] },

  // Student routes
  { path: "/my-classes", roles: ["murid"] },
  { path: "/modules", roles: ["murid"] },
  { path: "/my-mentor-schedule", roles: ["murid"] },
  { path: "/trial-registration", roles: ["murid"] },
  { path: "/extracurricular-registration", roles: ["murid"] },
  { path: "/enrollment-status", roles: ["murid"] },
  { path: "/portfolio", roles: ["murid"] },

  // School Principal routes
  { path: "/principal-org", roles: ["school_principal"] },
  { path: "/principal-reports", roles: ["school_principal"] },

  // Referrer routes
  { path: "/conversions", roles: ["referrer"] },
  { path: "/payouts", roles: ["referrer"] },

  // Shared: admin + referrer
  { path: "/referrals", roles: ["admin", "referrer"] },
];

const PUBLIC_ROUTES = ["/", "/login", "/register"];

function getRouteRule(pathname: string): RouteRule | undefined {
  return ROUTE_RULES.find(
    (rule) => pathname === rule.path || pathname.startsWith(rule.path + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const rule = getRouteRule(pathname);
  if (!rule) {
    // Dashboard and other unprotected routes are open to any authenticated user
    return NextResponse.next();
  }

  const roleCookie = request.cookies.get("sakode-role");
  const role = roleCookie?.value as UserRole | undefined;

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (rule.roles.includes(role)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
