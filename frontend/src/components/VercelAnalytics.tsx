import { Analytics } from "@vercel/analytics/react";

/** Vercel injects the insights script only on Vercel-hosted production builds. */
export default function VercelAnalytics() {
  if (!import.meta.env.PROD) {
    return null;
  }

  return <Analytics />;
}
