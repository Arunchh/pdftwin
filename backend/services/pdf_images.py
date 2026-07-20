import fitz

from utils import normalize_filename


def extract_images(content: bytes) -> list[tuple[str, bytes]]:
    doc = fitz.open(stream=content, filetype="pdf")

    try:
        if doc.is_encrypted:
            raise ValueError(
                "This PDF is password-protected. Unlock it first using the Lock / Unlock tab."
            )

        images: list[tuple[str, bytes]] = []

        for page_index in range(doc.page_count):
            for image_index, image_info in enumerate(doc.get_page_images(page_index), start=1):
                extracted = doc.extract_image(image_info[0])
                extension = extracted.get("ext", "png")
                filename = normalize_filename(
                    f"page{page_index + 1}_image{image_index}.{extension}"
                )
                images.append((filename, extracted["image"]))

        if not images:
            raise ValueError("No images were found in this PDF.")

        return images
    finally:
        doc.close()
