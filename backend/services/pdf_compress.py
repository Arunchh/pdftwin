import fitz


def compress_pdf(content: bytes, level: str = "medium") -> bytes:
    doc = fitz.open(stream=content, filetype="pdf")
    garbage = 4 if level == "high" else 3
    compressed = doc.tobytes(garbage=garbage, deflate=True, clean=True)
    doc.close()
    return compressed


def compression_stats(original: bytes, compressed: bytes) -> dict[str, int | float]:
    original_size = len(original)
    compressed_size = len(compressed)
    ratio = 0.0 if original_size == 0 else round((1 - compressed_size / original_size) * 100, 1)
    return {
        "original_bytes": original_size,
        "compressed_bytes": compressed_size,
        "saved_percent": max(ratio, 0.0),
    }
