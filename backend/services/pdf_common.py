from io import BytesIO

from pypdf import PdfReader, PdfWriter


def parse_page_selection(selection: str) -> list[int]:
    pages: list[int] = []

    for part in selection.replace(" ", "").split(","):
        if not part:
            continue
        if "-" in part:
            start_str, end_str = part.split("-", 1)
            start, end = int(start_str), int(end_str)
            if start > end:
                raise ValueError(f"Invalid range {start}-{end}.")
            pages.extend(range(start, end + 1))
        else:
            pages.append(int(part))

    if not pages:
        raise ValueError("Provide at least one page number.")

    return pages


def read_pdf_unprotected(content: bytes) -> PdfReader:
    reader = PdfReader(BytesIO(content))
    if reader.is_encrypted:
        raise ValueError(
            "This PDF is password-protected. Unlock it first using the Lock / Unlock tab."
        )
    return reader


def read_pdf(content: bytes, password: str | None = None) -> PdfReader:
    reader = PdfReader(BytesIO(content))

    if not reader.is_encrypted:
        return reader

    candidates: list[str] = []
    if password:
        candidates.append(password)
    candidates.extend(["", " "])

    seen: set[str] = set()
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        if reader.decrypt(candidate) in (1, 2):
            return reader

    raise ValueError(
        "This PDF is password-protected. Enter the password below. "
        "PDFs with strong encryption cannot be unlocked without the correct password."
    )


def write_pdf(writer: PdfWriter) -> bytes:
    output = BytesIO()
    writer.write(output)
    return output.getvalue()
