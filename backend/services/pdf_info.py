from io import BytesIO

from pypdf import PdfReader


def get_pdf_page_count(content: bytes) -> int:
    reader = PdfReader(BytesIO(content))
    if reader.is_encrypted:
        raise ValueError(
            "This PDF is password-protected. Unlock it first using the Lock / Unlock tab."
        )
    return len(reader.pages)
