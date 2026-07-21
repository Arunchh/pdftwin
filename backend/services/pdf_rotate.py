from pypdf import PdfWriter

from services.pdf_common import parse_page_selection, read_pdf_unprotected, write_pdf


def rotate_pdf(content: bytes, pages: str, angle: int) -> bytes:
    if angle not in {90, 180, 270}:
        raise ValueError("Rotation angle must be 90, 180, or 270 degrees.")

    reader = read_pdf_unprotected(content)
    total_pages = len(reader.pages)

    if pages.strip().lower() == "all":
        target_pages = list(range(1, total_pages + 1))
    else:
        target_pages = parse_page_selection(pages)
        for page_num in target_pages:
            if page_num < 1 or page_num > total_pages:
                raise ValueError(
                    f"Invalid page {page_num}. PDF has {total_pages} page(s)."
                )

    target_set = set(target_pages)
    writer = PdfWriter()

    for index, page in enumerate(reader.pages, start=1):
        if index in target_set:
            page.rotate(angle)
        writer.add_page(page)

    return write_pdf(writer)
