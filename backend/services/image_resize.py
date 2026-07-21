from io import BytesIO

from PIL import Image


def resize_image(
    content: bytes,
    max_width: int,
    max_height: int,
    quality: int = 85,
    output_format: str | None = None,
) -> tuple[bytes, str]:
    if max_width < 64 or max_height < 64:
        raise ValueError("Maximum dimensions must be at least 64 pixels.")
    if max_width > 8000 or max_height > 8000:
        raise ValueError("Maximum dimensions cannot exceed 8000 pixels.")
    if quality < 40 or quality > 100:
        raise ValueError("Quality must be between 40 and 100.")

    with Image.open(BytesIO(content)) as img:
        original_format = (img.format or "PNG").upper()
        if original_format == "JPG":
            original_format = "JPEG"

        target_format = (output_format or original_format).upper()
        if target_format == "JPG":
            target_format = "JPEG"

        if target_format not in {"JPEG", "PNG", "WEBP"}:
            target_format = "JPEG"

        working = img.copy()
        working.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

        if target_format in ("JPEG", "WEBP") and working.mode in ("RGBA", "P", "LA"):
            working = working.convert("RGB")

        buffer = BytesIO()
        save_kwargs: dict = {}
        if target_format == "JPEG":
            save_kwargs["quality"] = quality
            save_kwargs["optimize"] = True
        if target_format == "WEBP":
            save_kwargs["quality"] = quality

        working.save(buffer, format=target_format, **save_kwargs)

    extension = "jpg" if target_format == "JPEG" else target_format.lower()
    return buffer.getvalue(), extension


def resize_image_filename(filename: str, extension: str) -> str:
    stem = filename.rsplit(".", 1)[0] if "." in filename else filename
    return f"{stem}_resized.{extension}"
