import json
import os
import re
import urllib.error
import urllib.request

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def validate_email(email: str) -> str:
    normalized = normalize_email(email)
    if not normalized or not EMAIL_PATTERN.match(normalized):
        raise ValueError("Please enter a valid email address.")
    return normalized


def _supabase_config() -> tuple[str, str] | None:
    url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if url and key:
        return url.rstrip("/"), key
    return None


def submit_waitlist(email: str, name: str | None = None, source: str = "banner") -> dict:
    normalized_email = validate_email(email)
    trimmed_name = name.strip() if name else None

    config = _supabase_config()
    if not config:
        return {"ok": True, "stored": False, "email": normalized_email}

    supabase_url, service_key = config
    payload: dict[str, str] = {
        "email": normalized_email,
        "source": source,
    }
    if trimmed_name:
        payload["name"] = trimmed_name

    request = urllib.request.Request(
        f"{supabase_url}/rest/v1/waitlist_signups",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            if response.status not in {200, 201, 204}:
                raise RuntimeError("Waitlist signup failed.")
    except urllib.error.HTTPError as exc:
        if exc.code == 409:
            return {"ok": True, "stored": True, "duplicate": True, "email": normalized_email}
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Waitlist signup failed: {body}") from exc

    return {"ok": True, "stored": True, "duplicate": False, "email": normalized_email}
