import fitz


def docx_to_pdf(content: bytes) -> bytes:
    doc = fitz.open(stream=content, filetype="docx")
    try:
        return doc.convert_to_pdf()
    finally:
        doc.close()
