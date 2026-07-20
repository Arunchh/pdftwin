from pypdf import PdfWriter

from services.pdf_common import parse_page_selection, read_pdf_unprotected, write_pdf


def extract_pages(content: bytes, pages: str) -> bytes:
    selected_pages = parse_page_selection(pages)
    reader = read_pdf_unprotected(content)
    total_pages = len(reader.pages)

    writer = PdfWriter()
    for page_num in selected_pages:
        if page_num < 1 or page_num > total_pages:
            raise ValueError(
                f"Invalid page {page_num}. PDF has {total_pages} page(s)."
            )
        writer.add_page(reader.pages[page_num - 1])

    return write_pdf(writer)
