from pypdf import PdfWriter

from services.pdf_common import parse_page_selection, read_pdf_unprotected, write_pdf


def reorder_pdf(content: bytes, order: str) -> bytes:
    page_order = parse_page_selection(order)
    reader = read_pdf_unprotected(content)
    total_pages = len(reader.pages)

    writer = PdfWriter()
    for page_num in page_order:
        if page_num < 1 or page_num > total_pages:
            raise ValueError(
                f"Invalid page {page_num}. PDF has {total_pages} page(s)."
            )
        writer.add_page(reader.pages[page_num - 1])

    return write_pdf(writer)
