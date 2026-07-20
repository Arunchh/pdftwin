from pypdf import PdfWriter

from services.pdf_common import read_pdf, write_pdf


def unlock_pdf(content: bytes, password: str | None = None) -> bytes:
    reader = read_pdf(content, password)

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    return write_pdf(writer)
