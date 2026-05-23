import os
import pytesseract
from pdf2image import convert_from_path
from app.utils.image_preprocess import preprocess_image

TEMP_DIR = "temp_images"
os.makedirs(TEMP_DIR, exist_ok=True)

def extract_text_from_scanned_pdf(pdf_path: str) -> str:
    pages = convert_from_path(pdf_path, dpi=300)
    text = ""

    for i, page in enumerate(pages):
        image_path = os.path.join(TEMP_DIR, f"page_{i}.png")
        page.save(image_path, "PNG")

        processed_image = preprocess_image(image_path)
        page_text = pytesseract.image_to_string(processed_image, lang="eng")
        text += "\n" + page_text

    return text.strip()