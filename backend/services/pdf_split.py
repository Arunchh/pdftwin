from io import BytesIO

from pypdf import PdfReader, PdfWriter


def split_pdf(content: bytes, ranges: list[tuple[int, int]]) -> list[tuple[str, bytes]]:
    reader = PdfReader(BytesIO(content))
    total_pages = len(reader.pages)
    results: list[tuple[str, bytes]] = []

    for index, (start, end) in enumerate(ranges, start=1):
        if start < 1 or end > total_pages or start > end:
            raise ValueError(
                f"Invalid range {start}-{end}. PDF has {total_pages} page(s)."
            )

        writer = PdfWriter()
        for page_num in range(start - 1, end):
            writer.add_page(reader.pages[page_num])

        output = BytesIO()
        writer.write(output)
        filename = f"split_{index}_pages_{start}-{end}.pdf"
        results.append((filename, output.getvalue()))

    return results
