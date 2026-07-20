"""Quick verification for multilingual filename and text support."""

from starlette.responses import Response

from utils import attachment_header, normalize_unicode, output_filename

SAMPLES = {
    "hindi": "रिपोर्ट_2024.pdf",
    "arabic": "تقرير_2024.pdf",
    "greek": "Αναφορά_2024.pdf",
    "japanese": "レポート_2024.pdf",
    "russian": "Отчёт_2024.pdf",
    "chinese": "报告_2024.pdf",
}


def test_attachment_headers() -> None:
    for label, filename in SAMPLES.items():
        header = attachment_header(output_filename(filename, ".xlsx"))
        Response(content=b"ok", headers=header)
        assert "filename*=UTF-8''" in header["Content-Disposition"]
        print(f"[ok] {label}: {header['Content-Disposition']}")


def test_text_normalization() -> None:
    samples = ["नमस्ते", "مرحبا", "Γειά σου", "こんにちは", "Привет", "你好"]
    for text in samples:
        normalized = normalize_unicode(text)
        assert normalized == text
        print(f"[ok] text preserved: {ascii(text)}")


if __name__ == "__main__":
    test_attachment_headers()
    test_text_normalization()
    print("All multilingual checks passed.")
