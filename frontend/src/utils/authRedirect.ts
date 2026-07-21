export function authReturnPath(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  const path = window.location.pathname + window.location.search + window.location.hash;
  return path.startsWith("/") ? path : "/";
}

export function loginHref(next?: string): string {
  const target = next ?? authReturnPath();
  return `/login?next=${encodeURIComponent(target)}`;
}

export function signupHref(next?: string): string {
  const target = next ?? authReturnPath();
  return `/signup?next=${encodeURIComponent(target)}`;
}

export function readNextPath(): string {
  if (typeof window === "undefined") {
    return "/account";
  }

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (!next || !next.startsWith("/")) {
    return "/account";
  }
  return next;
}
