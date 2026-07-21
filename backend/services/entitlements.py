import os
from contextvars import ContextVar

FREE_FILE_LIMIT_MB = int(os.environ.get("FREE_FILE_LIMIT_MB", "24"))
PRO_FILE_LIMIT_MB = int(os.environ.get("PRO_FILE_LIMIT_MB", "200"))

FREE_FILE_LIMIT_BYTES = FREE_FILE_LIMIT_MB * 1024 * 1024
PRO_FILE_LIMIT_BYTES = PRO_FILE_LIMIT_MB * 1024 * 1024

current_plan: ContextVar[str] = ContextVar("current_plan", default="free")


def normalize_plan(plan_header: str | None) -> str:
    return "pro" if plan_header == "pro" else "free"


def file_limit_bytes(plan: str | None = None) -> int:
    resolved = plan or current_plan.get()
    return PRO_FILE_LIMIT_BYTES if resolved == "pro" else FREE_FILE_LIMIT_BYTES


def file_limit_mb(plan: str | None = None) -> int:
    resolved = plan or current_plan.get()
    return PRO_FILE_LIMIT_MB if resolved == "pro" else FREE_FILE_LIMIT_MB


def plan_payload(plan: str, user_id: str | None = None) -> dict:
    return {
        "authenticated": bool(user_id),
        "user_id": user_id,
        "plan": plan,
        "file_limit_mb": file_limit_mb(plan),
        "auth_provider": os.environ.get("AUTH_PROVIDER", "mock"),
        "billing_provider": "mock",
    }
