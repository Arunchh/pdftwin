from io import BytesIO

from pypdf import PdfReader, PdfWriter


def merge_pdfs(file_contents: list[bytes]) -> bytes:
    writer = PdfWriter()

    for content in file_contents:
        reader = PdfReader(BytesIO(content))
        for page in reader.pages:
            writer.add_page(page)

    output = BytesIO()
    writer.write(output)
    return output.getvalue()
