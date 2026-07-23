import os
from datetime import date

from fastapi import HTTPException, Request, Response

from services.entitlements import FREE_DAILY_DOC_CONVERT_LIMIT, current_plan

DOC_CONVERT_COOKIE = "pdftwin_doc_convert"


def _today_key() -> str:
    return date.today().isoformat()


def _read_count(request: Request) -> int:
    raw = request.cookies.get(DOC_CONVERT_COOKIE, "")
    today = _today_key()
    if not raw.startswith(f"{today}:"):
        return 0
    try:
        return int(raw.split(":", 1)[1])
    except (IndexError, ValueError):
        return 0


def remaining_doc_converts(request: Request, plan: str | None = None) -> int | None:
    """Return remaining free conversions, or None when unlimited (Pro)."""
    resolved = plan or current_plan.get()
    if resolved == "pro":
        return None
    return max(0, FREE_DAILY_DOC_CONVERT_LIMIT - _read_count(request))


def assert_doc_convert_allowed(request: Request, plan: str | None = None) -> None:
    resolved = plan or current_plan.get()
    if resolved == "pro":
        return

    if _read_count(request) >= FREE_DAILY_DOC_CONVERT_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Free plan allows {FREE_DAILY_DOC_CONVERT_LIMIT} PDF to Word or Excel "
                "conversions per day. Upgrade to Pro for unlimited exports."
            ),
        )


def mark_doc_convert(request: Request, response: Response, plan: str | None = None) -> int:
    """
    Record a successful PDF → Word/Excel conversion for free users.
    Returns remaining conversions after this operation (-1 for unlimited Pro).
    """
    resolved = plan or current_plan.get()
    if resolved == "pro":
        return -1

    next_count = _read_count(request) + 1
    response.set_cookie(
        key=DOC_CONVERT_COOKIE,
        value=f"{_today_key()}:{next_count}",
        max_age=86_400,
        httponly=True,
        samesite="lax",
        secure=os.environ.get("VERCEL") == "1",
    )
    remaining = max(0, FREE_DAILY_DOC_CONVERT_LIMIT - next_count)
    response.headers["X-Daily-Convert-Remaining"] = str(remaining)
    return remaining
