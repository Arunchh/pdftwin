from pypdf import PdfWriter

from services.pdf_common import read_pdf, write_pdf


def lock_pdf(content: bytes, password: str, current_password: str | None = None) -> bytes:
    cleaned_password = password.strip()
    if not cleaned_password:
        raise ValueError("A password is required to lock the PDF.")

    reader = read_pdf(content, current_password)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(cleaned_password, cleaned_password)
    return write_pdf(writer)
