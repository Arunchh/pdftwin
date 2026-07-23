import io
import json
import zipfile
from typing import Annotated

from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse

from services.docx_to_pdf import docx_to_pdf
from services.image_convert import convert_image, convert_image_filename
from services.image_resize import resize_image, resize_image_filename
from services.pdf_arrange_merge import arrange_and_merge
from services.pdf_compress import compress_pdf, compression_stats
from services.pdf_convert import pdf_to_excel, pdf_to_word
from services.pdf_extract import extract_pages
from services.pdf_images import extract_images
from services.pdf_info import get_pdf_page_count
from services.pdf_lock import lock_pdf
from services.pdf_merge import merge_pdfs
from services.pdf_reorder import reorder_pdf
from services.pdf_rotate import rotate_pdf
from services.pdf_split import split_pdf
from services.pdf_unlock import unlock_pdf
from services.pdf_watermark import add_pdf_watermark
from services import entitlements as entitlements_service
from services import paypal_service
from services.daily_usage import assert_doc_convert_allowed, mark_doc_convert, remaining_doc_converts
from utils import attachment_header, normalize_filename, output_filename, write_zip_entry

app = FastAPI(title="PDFTwin API")

FREE_FILE_LIMIT_MB = entitlements_service.FREE_FILE_LIMIT_MB
FREE_FILE_LIMIT_BYTES = entitlements_service.FREE_FILE_LIMIT_BYTES
PRO_FILE_LIMIT_MB = entitlements_service.PRO_FILE_LIMIT_MB
PRO_FILE_LIMIT_BYTES = entitlements_service.PRO_FILE_LIMIT_BYTES
FREE_DAILY_DOC_CONVERT_LIMIT = entitlements_service.FREE_DAILY_DOC_CONVERT_LIMIT


class PayPalConnectRequest(BaseModel):
    client_id: str = Field(min_length=1)
    client_secret: str = Field(min_length=1)
    mode: str = "sandbox"


class PayPalSubscriptionRequest(BaseModel):
    return_url: str = Field(min_length=1)
    cancel_url: str = Field(min_length=1)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4321",
        "http://127.0.0.1:4321",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://pdftwin.com",
        "https://www.pdftwin.com",
    ],
    allow_origin_regex=r"https://(.*\.)?(vercel\.app|pdftwin\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".pdf", ".xlsx", ".xls", ".docx", ".doc"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif"}


def validate_extension(filename: str, allowed: set[str] | None = None) -> str:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    allowed_set = allowed or ALLOWED_EXTENSIONS
    if ext not in allowed_set:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(allowed_set))}",
        )
    return ext


def read_upload(file: UploadFile, allowed: set[str] | None = None) -> bytes:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")
    validate_extension(file.filename, allowed)
    content = file.file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(content) > entitlements_service.file_limit_bytes():
        limit_mb = entitlements_service.file_limit_mb()
        plan_label = entitlements_service.current_plan.get()
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {limit_mb} MB {plan_label} plan limit.",
        )
    return content


@app.middleware("http")
async def apply_plan_entitlements(request: Request, call_next):
    plan = entitlements_service.normalize_plan(request.headers.get("x-pdftwin-plan"))
    token = entitlements_service.current_plan.set(plan)
    try:
        return await call_next(request)
    finally:
        entitlements_service.current_plan.reset(token)


@app.get("/api/me")
def get_me(
    x_pdftwin_plan: Annotated[str | None, Header()] = None,
    x_pdftwin_user_id: Annotated[str | None, Header()] = None,
):
    plan = entitlements_service.normalize_plan(x_pdftwin_plan)
    return entitlements_service.plan_payload(plan, x_pdftwin_user_id)


@app.post("/api/webhooks/paypal")
async def paypal_webhook_stub():
    """Placeholder for PayPal subscription webhooks — wire up when billing goes live."""
    return {"received": True, "status": "stub"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/config")
def app_config():
    payment = paypal_service.get_payment_config()
    return {
        "free_file_limit_mb": FREE_FILE_LIMIT_MB,
        "pro_file_limit_mb": PRO_FILE_LIMIT_MB,
        "free_daily_doc_convert_limit": FREE_DAILY_DOC_CONVERT_LIMIT,
        "payments": {
            "configured": payment["configured"],
            "mode": payment["mode"],
            "client_id": payment["client_id"],
            "pro_price": payment["pro_price"],
            "pro_currency": payment["pro_currency"],
        },
    }


@app.get("/api/payments/config")
def payments_config():
    payment = paypal_service.get_payment_config()
    return {
        "configured": payment["configured"],
        "client_id": payment["client_id"],
        "mode": payment["mode"],
        "pro_price": payment["pro_price"],
        "pro_currency": payment["pro_currency"],
    }


@app.post("/api/payments/connect")
def payments_connect(payload: PayPalConnectRequest):
    mode = payload.mode.lower()
    if mode not in {"sandbox", "live"}:
        raise HTTPException(status_code=400, detail="Mode must be sandbox or live.")

    try:
        result = paypal_service.verify_connection(
            payload.client_id.strip(),
            payload.client_secret.strip(),
            mode,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return result


@app.post("/api/payments/create-subscription")
def payments_create_subscription(payload: PayPalSubscriptionRequest):
    try:
        return paypal_service.create_subscription(payload.return_url, payload.cancel_url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/payments/subscription/{subscription_id}")
def payments_subscription_status(subscription_id: str):
    try:
        return paypal_service.get_subscription_status(subscription_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/upload")
async def upload_files(files: Annotated[list[UploadFile], File(...)]):
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required.")

    uploaded = []
    for file in files:
        content = read_upload(file)
        uploaded.append(
            {
                "filename": normalize_filename(file.filename),
                "size": len(content),
                "type": validate_extension(file.filename),
            }
        )

    return {"message": f"Successfully uploaded {len(uploaded)} file(s).", "files": uploaded}


def read_pdf_upload(file: UploadFile) -> bytes:
    validate_extension(file.filename or "", {".pdf"})
    return read_upload(file, {".pdf"})


def read_image_upload(file: UploadFile) -> bytes:
    validate_extension(file.filename or "", IMAGE_EXTENSIONS)
    return read_upload(file, IMAGE_EXTENSIONS)


def pdf_error_response(exc: Exception, action: str) -> HTTPException:
    if isinstance(exc, ValueError):
        return HTTPException(status_code=400, detail=str(exc))
    return HTTPException(status_code=500, detail=f"Failed to {action}: {exc}")


@app.post("/api/merge")
async def merge(files: Annotated[list[UploadFile], File(...)]):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required to merge.")

    contents = []
    for file in files:
        ext = validate_extension(file.filename or "")
        if ext != ".pdf":
            raise HTTPException(status_code=400, detail="Only PDF files can be merged.")
        contents.append(read_upload(file))

    try:
        merged = merge_pdfs(contents)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to merge PDFs: {exc}") from exc

    return Response(
        content=merged,
        media_type="application/pdf",
        headers=attachment_header("merged.pdf"),
    )


@app.post("/api/arrange-merge")
async def arrange_merge(
    files: Annotated[list[UploadFile], File(...)],
    page_orders: Annotated[str, Form()] = "[]",
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required to merge.")

    try:
        orders_payload = json.loads(page_orders)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid page order data.") from exc

    if not isinstance(orders_payload, list):
        raise HTTPException(status_code=400, detail="Page order data must be a list.")

    if len(orders_payload) != len(files):
        raise HTTPException(
            status_code=400,
            detail="Page order data must include one entry per PDF file.",
        )

    contents = []
    normalized_orders: list[str | None] = []

    for file, page_order in zip(files, orders_payload):
        ext = validate_extension(file.filename or "")
        if ext != ".pdf":
            raise HTTPException(status_code=400, detail="Only PDF files can be merged.")
        contents.append(read_upload(file))
        normalized_orders.append(page_order if isinstance(page_order, str) and page_order.strip() else None)

    try:
        merged = arrange_and_merge(contents, normalized_orders)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to arrange and merge PDFs: {exc}") from exc

    return Response(
        content=merged,
        media_type="application/pdf",
        headers=attachment_header("merged.pdf"),
    )


@app.post("/api/split")
async def split(
    file: Annotated[UploadFile, File(...)],
    ranges: Annotated[str, Form(...)],
):
    """
    Split a PDF using page ranges.
    Format: "1-3,5-7,10" (single pages like "10" become "10-10")
    """
    ext = validate_extension(file.filename or "")
    if ext != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF files can be split.")

    content = read_upload(file)
    parsed_ranges: list[tuple[int, int]] = []

    for part in ranges.replace(" ", "").split(","):
        if not part:
            continue
        if "-" in part:
            start_str, end_str = part.split("-", 1)
            parsed_ranges.append((int(start_str), int(end_str)))
        else:
            page = int(part)
            parsed_ranges.append((page, page))

    if not parsed_ranges:
        raise HTTPException(status_code=400, detail="Provide at least one page range.")

    try:
        split_files = split_pdf(content, parsed_ranges)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to split PDF: {exc}") from exc

    if len(split_files) == 1:
        filename, data = split_files[0]
        return Response(
            content=data,
            media_type="application/pdf",
            headers=attachment_header(filename),
        )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for filename, data in split_files:
            write_zip_entry(zip_file, filename, data)
    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers=attachment_header("split_pdfs.zip"),
    )


@app.post("/api/convert/pdf-to-word")
async def convert_pdf_to_word(
    request: Request,
    file: Annotated[UploadFile, File(...)],
):
    plan = entitlements_service.current_plan.get()
    assert_doc_convert_allowed(request, plan)

    ext = validate_extension(file.filename or "")
    if ext != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF files can be converted to Word.")

    content = read_upload(file)

    try:
        docx_bytes = pdf_to_word(content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to Word: {exc}") from exc

    base_name = output_filename(file.filename, ".docx")
    response = Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=attachment_header(base_name),
    )
    mark_doc_convert(request, response, plan)
    return response


@app.post("/api/convert/pdf-to-excel")
async def convert_pdf_to_excel(
    request: Request,
    file: Annotated[UploadFile, File(...)],
):
    plan = entitlements_service.current_plan.get()
    assert_doc_convert_allowed(request, plan)

    ext = validate_extension(file.filename or "")
    if ext != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF files can be converted to Excel.")

    content = read_upload(file)

    try:
        xlsx_bytes = pdf_to_excel(content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to Excel: {exc}") from exc

    base_name = output_filename(file.filename, ".xlsx")
    response = Response(
        content=xlsx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=attachment_header(base_name),
    )
    mark_doc_convert(request, response, plan)
    return response


@app.post("/api/pdf-info")
async def pdf_info(file: Annotated[UploadFile, File(...)]):
    content = read_pdf_upload(file)

    try:
        page_count = get_pdf_page_count(content)
    except Exception as exc:
        raise pdf_error_response(exc, "read PDF info") from exc

    return {"page_count": page_count, "filename": normalize_filename(file.filename or "document.pdf")}


@app.post("/api/reorder")
async def reorder(
    file: Annotated[UploadFile, File(...)],
    order: Annotated[str, Form(...)],
):
    content = read_pdf_upload(file)

    try:
        result = reorder_pdf(content, order)
    except Exception as exc:
        raise pdf_error_response(exc, "reorder PDF") from exc

    base_name = output_filename(file.filename, "_reordered.pdf")
    return Response(
        content=result,
        media_type="application/pdf",
        headers=attachment_header(base_name),
    )


@app.post("/api/extract-pages")
async def extract_pages_endpoint(
    file: Annotated[UploadFile, File(...)],
    pages: Annotated[str, Form(...)],
):
    content = read_pdf_upload(file)

    try:
        result = extract_pages(content, pages)
    except Exception as exc:
        raise pdf_error_response(exc, "extract pages") from exc

    base_name = output_filename(file.filename, "_extracted.pdf")
    return Response(
        content=result,
        media_type="application/pdf",
        headers=attachment_header(base_name),
    )


@app.post("/api/extract-images")
async def extract_images_endpoint(
    file: Annotated[UploadFile, File(...)],
    output_format: Annotated[str | None, Form()] = None,
):
    content = read_pdf_upload(file)

    try:
        image_files = extract_images(content)
        if output_format:
            converted: list[tuple[str, bytes]] = []
            for filename, data in image_files:
                converted_bytes, _ = convert_image(data, output_format)
                converted.append((convert_image_filename(filename, output_format), converted_bytes))
            image_files = converted
    except Exception as exc:
        raise pdf_error_response(exc, "extract images") from exc

    if len(image_files) == 1:
        filename, data = image_files[0]
        ext = filename.rsplit(".", 1)[-1].lower()
        media_types = {
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "bmp": "image/bmp",
            "tiff": "image/tiff",
            "webp": "image/webp",
        }
        return Response(
            content=data,
            media_type=media_types.get(ext, "application/octet-stream"),
            headers=attachment_header(filename),
        )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for filename, data in image_files:
            write_zip_entry(zip_file, filename, data)
    zip_buffer.seek(0)

    base_name = output_filename(file.filename, "_images.zip")
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers=attachment_header(base_name),
    )


@app.post("/api/unlock")
async def unlock(
    file: Annotated[UploadFile, File(...)],
    password: Annotated[str | None, Form()] = None,
):
    content = read_pdf_upload(file)

    try:
        result = unlock_pdf(content, password or None)
    except Exception as exc:
        raise pdf_error_response(exc, "unlock PDF") from exc

    base_name = output_filename(file.filename, "_unlocked.pdf")
    return Response(
        content=result,
        media_type="application/pdf",
        headers=attachment_header(base_name),
    )


@app.post("/api/lock")
async def lock(
    file: Annotated[UploadFile, File(...)],
    password: Annotated[str, Form(...)],
    current_password: Annotated[str | None, Form()] = None,
):
    content = read_pdf_upload(file)

    try:
        result = lock_pdf(content, password, current_password or None)
    except Exception as exc:
        raise pdf_error_response(exc, "lock PDF") from exc

    base_name = output_filename(file.filename, "_locked.pdf")
    return Response(
        content=result,
        media_type="application/pdf",
        headers=attachment_header(base_name),
    )


@app.post("/api/convert/image")
async def convert_image_endpoint(
    files: Annotated[list[UploadFile], File(...)],
    output_format: Annotated[str, Form(...)],
):
    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one image to convert.")

    try:
        converted_files: list[tuple[str, bytes]] = []
        for file in files:
            content = read_image_upload(file)
            converted_bytes, extension = convert_image(content, output_format)
            filename = convert_image_filename(file.filename or f"converted.{extension}", output_format)
            converted_files.append((filename, converted_bytes))
    except HTTPException:
        raise
    except Exception as exc:
        raise pdf_error_response(exc, "convert image") from exc

    if len(converted_files) == 1:
        filename, data = converted_files[0]
        ext = filename.rsplit(".", 1)[-1].lower()
        media_types = {
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "webp": "image/webp",
        }
        return Response(
            content=data,
            media_type=media_types.get(ext, "application/octet-stream"),
            headers=attachment_header(filename),
        )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for filename, data in converted_files:
            write_zip_entry(zip_file, filename, data)
    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers=attachment_header("converted_images.zip"),
    )


@app.post("/api/compress")
async def compress(
    file: Annotated[UploadFile, File(...)],
    level: Annotated[str, Form()] = "medium",
):
    content = read_pdf_upload(file)
    normalized_level = level if level in {"medium", "high"} else "medium"

    try:
        compressed = compress_pdf(content, normalized_level)
        stats = compression_stats(content, compressed)
    except Exception as exc:
        raise pdf_error_response(exc, "compress PDF") from exc

    filename = output_filename(file.filename, ".pdf")
    if not filename.lower().startswith("compressed"):
        base = filename.rsplit(".", 1)[0]
        filename = f"{base}_compressed.pdf"

    return Response(
        content=compressed,
        media_type="application/pdf",
        headers={
            **attachment_header(filename),
            "X-Compression-Saved-Percent": str(stats["saved_percent"]),
        },
    )


@app.post("/api/rotate")
async def rotate(
    file: Annotated[UploadFile, File(...)],
    pages: Annotated[str, Form(...)],
    angle: Annotated[int, Form(...)],
):
    content = read_pdf_upload(file)

    try:
        rotated = rotate_pdf(content, pages, angle)
    except Exception as exc:
        raise pdf_error_response(exc, "rotate PDF") from exc

    filename = output_filename(file.filename, ".pdf")
    return Response(
        content=rotated,
        media_type="application/pdf",
        headers=attachment_header(filename),
    )


@app.post("/api/watermark")
async def watermark(
    file: Annotated[UploadFile, File(...)],
    text: Annotated[str, Form(...)],
    opacity: Annotated[float, Form()] = 0.25,
):
    content = read_pdf_upload(file)

    try:
        stamped = add_pdf_watermark(content, text, opacity)
    except Exception as exc:
        raise pdf_error_response(exc, "add watermark") from exc

    filename = output_filename(file.filename, ".pdf")
    base = filename.rsplit(".", 1)[0]
    filename = f"{base}_watermarked.pdf"

    return Response(
        content=stamped,
        media_type="application/pdf",
        headers=attachment_header(filename),
    )


@app.post("/api/convert/word-to-pdf")
async def convert_word_to_pdf(file: Annotated[UploadFile, File(...)]):
    validate_extension(file.filename or "", {".docx"})
    content = read_upload(file, {".docx"})

    try:
        pdf_bytes = docx_to_pdf(content)
    except Exception as exc:
        raise pdf_error_response(exc, "convert Word to PDF") from exc

    filename = output_filename(file.filename, ".pdf")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers=attachment_header(filename),
    )


@app.post("/api/convert/image-resize")
async def convert_image_resize(
    file: Annotated[UploadFile, File(...)],
    max_width: Annotated[int, Form(...)],
    max_height: Annotated[int, Form(...)],
    quality: Annotated[int, Form()] = 85,
    output_format: Annotated[str, Form()] = "",
):
    content = read_image_upload(file)

    try:
        data, extension = resize_image(
            content,
            max_width,
            max_height,
            quality,
            output_format or None,
        )
    except Exception as exc:
        raise pdf_error_response(exc, "resize image") from exc

    filename = resize_image_filename(normalize_filename(file.filename), extension)
    media_types = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
    }

    return Response(
        content=data,
        media_type=media_types.get(extension, "application/octet-stream"),
        headers=attachment_header(filename),
    )
