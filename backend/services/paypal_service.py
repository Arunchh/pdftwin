import base64
import json
import os
import urllib.error
import urllib.request
from typing import Any

PAYPAL_API_BASE = {
    "sandbox": "https://api-m.sandbox.paypal.com",
    "live": "https://api-m.paypal.com",
}

PRO_PRODUCT_NAME = "PDFTwin Pro"
PRO_PRODUCT_DESCRIPTION = "Higher file limits, priority processing, and batch tools."
PRO_PLAN_PRICE = "7.00"
PRO_PLAN_CURRENCY = "USD"


def _mode() -> str:
    mode = os.environ.get("PAYPAL_MODE", "sandbox").lower()
    return mode if mode in PAYPAL_API_BASE else "sandbox"


def _api_base(mode: str | None = None) -> str:
    return PAYPAL_API_BASE[mode or _mode()]


def get_payment_config() -> dict[str, Any]:
    client_id = os.environ.get("PAYPAL_CLIENT_ID", "").strip()
    client_secret = os.environ.get("PAYPAL_CLIENT_SECRET", "").strip()
    plan_id = os.environ.get("PAYPAL_PLAN_ID", "").strip()
    mode = _mode()

    return {
        "configured": bool(client_id and client_secret),
        "client_id": client_id,
        "mode": mode,
        "plan_id": plan_id,
        "pro_price": PRO_PLAN_PRICE,
        "pro_currency": PRO_PLAN_CURRENCY,
    }


def _request(
    method: str,
    path: str,
    *,
    access_token: str,
    mode: str,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    url = f"{_api_base(mode)}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ValueError(f"PayPal API error ({exc.code}): {detail}") from exc


def get_access_token(client_id: str, client_secret: str, mode: str) -> str:
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("ascii")
    request = urllib.request.Request(
        f"{_api_base(mode)}/v1/oauth2/token",
        data=b"grant_type=client_credentials",
        method="POST",
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ValueError(f"PayPal authentication failed ({exc.code}): {detail}") from exc

    token = payload.get("access_token")
    if not token:
        raise ValueError("PayPal did not return an access token.")
    return token


def verify_connection(
    client_id: str,
    client_secret: str,
    mode: str,
) -> dict[str, Any]:
    token = get_access_token(client_id, client_secret, mode)
    return {
        "connected": True,
        "mode": mode,
        "message": "PayPal account verified. Add credentials to server environment variables to enable live checkout.",
        "token_preview": f"{token[:8]}…",
    }


def _ensure_billing_plan(access_token: str, mode: str, plan_id: str) -> str:
    if plan_id:
        return plan_id

    product = _request(
        "POST",
        "/v1/catalogs/products",
        access_token=access_token,
        mode=mode,
        payload={
            "name": PRO_PRODUCT_NAME,
            "description": PRO_PRODUCT_DESCRIPTION,
            "type": "SERVICE",
            "category": "SOFTWARE",
        },
    )

    product_id = product.get("id")
    if not product_id:
        raise ValueError("PayPal did not return a product id.")

    plan = _request(
        "POST",
        "/v1/billing/plans",
        access_token=access_token,
        mode=mode,
        payload={
            "product_id": product_id,
            "name": f"{PRO_PRODUCT_NAME} Monthly",
            "description": PRO_PRODUCT_DESCRIPTION,
            "billing_cycles": [
                {
                    "frequency": {"interval_unit": "MONTH", "interval_count": 1},
                    "tenure_type": "REGULAR",
                    "sequence": 1,
                    "total_cycles": 0,
                    "pricing_scheme": {
                        "fixed_price": {
                            "value": PRO_PLAN_PRICE,
                            "currency_code": PRO_PLAN_CURRENCY,
                        }
                    },
                }
            ],
            "payment_preferences": {
                "auto_bill_outstanding": True,
                "setup_fee_failure_action": "CONTINUE",
                "payment_failure_threshold": 3,
            },
        },
    )

    created_plan_id = plan.get("id")
    if not created_plan_id:
        raise ValueError("PayPal did not return a billing plan id.")
    return created_plan_id


def create_subscription(return_url: str, cancel_url: str) -> dict[str, Any]:
    config = get_payment_config()
    if not config["configured"]:
        raise ValueError("PayPal is not configured on the server.")

    client_id = os.environ["PAYPAL_CLIENT_ID"].strip()
    client_secret = os.environ["PAYPAL_CLIENT_SECRET"].strip()
    mode = config["mode"]
    access_token = get_access_token(client_id, client_secret, mode)
    plan_id = _ensure_billing_plan(access_token, mode, config["plan_id"])

    subscription = _request(
        "POST",
        "/v1/billing/subscriptions",
        access_token=access_token,
        mode=mode,
        payload={
            "plan_id": plan_id,
            "application_context": {
                "brand_name": "PDFTwin",
                "locale": "en-US",
                "shipping_preference": "NO_SHIPPING",
                "user_action": "SUBSCRIBE_NOW",
                "return_url": return_url,
                "cancel_url": cancel_url,
            },
        },
    )

    approval_url = next(
        (link["href"] for link in subscription.get("links", []) if link.get("rel") == "approve"),
        None,
    )
    if not approval_url:
        raise ValueError("PayPal did not return an approval link.")

    return {
        "subscription_id": subscription.get("id"),
        "approval_url": approval_url,
        "plan_id": plan_id,
    }


def get_subscription_status(subscription_id: str) -> dict[str, Any]:
    config = get_payment_config()
    if not config["configured"]:
        raise ValueError("PayPal is not configured on the server.")

    access_token = get_access_token(
        os.environ["PAYPAL_CLIENT_ID"].strip(),
        os.environ["PAYPAL_CLIENT_SECRET"].strip(),
        config["mode"],
    )

    subscription = _request(
        "GET",
        f"/v1/billing/subscriptions/{subscription_id}",
        access_token=access_token,
        mode=config["mode"],
    )

    return {
        "subscription_id": subscription.get("id"),
        "status": subscription.get("status"),
        "plan_id": subscription.get("plan_id"),
    }
