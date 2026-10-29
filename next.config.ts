import type { NextConfig } from "next";
const aliases: Record<string, string> = {
  "/search-receiver": "/transfer",
  "/input-amount": "/transfer",
  "/confirmation": "/transfer",
  "/status-success": "/activity",
  "/status-failed": "/activity",
  "/personal-information": "/profile/personal",
  "/manage-phone-number": "/profile/phone",
  "/add-phone-number": "/profile/phone",
  "/change-password": "/profile/password",
  "/change-pin": "/profile/pin",
  "/create-pin": "/onboarding/pin",
  "/create-pin-success": "/dashboard",
  "/confirm-email": "/forgot-password",
  "/reset-password": "/forgot-password",
};
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return Object.entries(aliases).map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
          },
        ],
      },
    ];
  },
};
export default config;
