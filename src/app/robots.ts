import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/transfer",
        "/top-up",
        "/activity",
        "/profile",
        "/transactions",
        "/reset-password",
        "/onboarding",
      ],
    },
  };
}
