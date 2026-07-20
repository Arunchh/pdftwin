from io import BytesIO

from PIL import Image

OUTPUT_FORMATS = {"png", "jpeg", "webp"}


def normalize_output_format(output_format: str) -> str:
    normalized = output_format.lower().strip()
    if normalized == "jpg":
        normalized = "jpeg"
    if normalized not in OUTPUT_FORMATS:
        raise ValueError("Unsupported output format. Choose png, jpeg, or webp.")
    return normalized


def convert_image(content: bytes, output_format: str) -> tuple[bytes, str]:
    target = normalize_output_format(output_format)

    with Image.open(BytesIO(content)) as img:
        if target in ("jpeg", "webp") and img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")

        buffer = BytesIO()
        save_format = "JPEG" if target == "jpeg" else target.upper()
        save_kwargs: dict = {}
        if target == "jpeg":
            save_kwargs["quality"] = 90
        if target == "webp":
            save_kwargs["quality"] = 85

        img.save(buffer, format=save_format, **save_kwargs)

    extension = "jpg" if target == "jpeg" else target
    return buffer.getvalue(), extension


def convert_image_filename(filename: str, output_format: str) -> str:
    target = normalize_output_format(output_format)
    extension = "jpg" if target == "jpeg" else target
    stem = filename.rsplit(".", 1)[0] if "." in filename else filename
    return f"{stem}.{extension}"
