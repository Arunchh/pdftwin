from pypdf import PdfWriter

from services.pdf_common import read_pdf_unprotected, write_pdf


def merge_pdfs(file_contents: list[bytes]) -> bytes:
    writer = PdfWriter()

    for content in file_contents:
        reader = read_pdf_unprotected(content)
        for page in reader.pages:
            writer.add_page(page)

    return write_pdf(writer)
