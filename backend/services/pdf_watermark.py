import fitz


def add_pdf_watermark(content: bytes, text: str, opacity: float = 0.25) -> bytes:
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("Watermark text is required.")

    if len(cleaned) > 120:
        raise ValueError("Watermark text must be 120 characters or fewer.")

    opacity = max(0.1, min(opacity, 0.6))
    gray = 1.0 - opacity

    doc = fitz.open(stream=content, filetype="pdf")
    for page in doc:
        rect = page.rect
        font_size = max(24, min(rect.width, rect.height) / 12)
        page.insert_text(
            (rect.width * 0.2, rect.height * 0.55),
            cleaned,
            fontsize=font_size,
            color=(gray, gray, gray),
            rotate=45,
            overlay=True,
        )

    result = doc.tobytes(deflate=True)
    doc.close()
    return result
