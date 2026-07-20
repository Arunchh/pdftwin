import re
import unicodedata
import zipfile
from urllib.parse import quote

# Strip only XML-illegal control characters; keep all Unicode letters/symbols.
_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")
_INVALID_FILENAME_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]')


def normalize_unicode(text: str) -> str:
    """Normalize text to NFC and remove illegal control characters."""
    if not text:
        return ""
    normalized = unicodedata.normalize("NFC", text)
    return _CONTROL_CHARS.sub("", normalized)


def normalize_filename(filename: str) -> str:
    """Normalize filenames while preserving non-English scripts."""
    cleaned = normalize_unicode(filename.strip())
    cleaned = _INVALID_FILENAME_CHARS.sub("_", cleaned)
    cleaned = cleaned.replace("\u202e", "")  # RTL override (path spoofing)
    return cleaned.strip() or "download"


def output_filename(upload_name: str | None, extension: str) -> str:
    base = normalize_filename((upload_name or "document").rsplit(".", 1)[0])
    ext = extension if extension.startswith(".") else f".{extension}"
    return f"{base}{ext}"


def attachment_header(filename: str) -> dict[str, str]:
    """Build a Content-Disposition header that supports all UTF-8 filenames."""
    safe_name = normalize_filename(filename)
    ascii_fallback = "".join(c if ord(c) < 128 else "_" for c in safe_name).strip() or "download"
    encoded = quote(safe_name, safe="")
    value = f"attachment; filename=\"{ascii_fallback}\"; filename*=UTF-8''{encoded}"
    return {"Content-Disposition": value}


def write_zip_entry(archive: zipfile.ZipFile, filename: str, data: bytes) -> None:
    """Write a ZIP entry with UTF-8 filename support for international names."""
    name = normalize_filename(filename)
    info = zipfile.ZipInfo(name)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.flag_bits |= 0x800
    archive.writestr(info, data)
