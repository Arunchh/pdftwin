import json

from services.pdf_merge import merge_pdfs
from services.pdf_reorder import reorder_pdf


def arrange_and_merge(contents: list[bytes], page_orders: list[str | None]) -> bytes:
    if len(contents) < 2:
        raise ValueError("At least 2 PDF files are required to merge.")

    if len(page_orders) != len(contents):
        raise ValueError("Page order data does not match the number of files.")

    processed: list[bytes] = []
    for content, page_order in zip(contents, page_orders):
        if page_order and page_order.strip():
            processed.append(reorder_pdf(content, page_order))
        else:
            processed.append(content)

    return merge_pdfs(processed)
