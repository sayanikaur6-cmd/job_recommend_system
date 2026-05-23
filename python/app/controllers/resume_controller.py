from fastapi import UploadFile, HTTPException
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_from_scanned_pdf
from app.services.parser_service import parse_resume_data
from app.utils.file_handler import save_uploaded_file

async def parse_resume_controller(file: UploadFile):
    try:
        file_path = save_uploaded_file(file)

        text = extract_text_from_pdf(file_path)

        if len(text.strip()) < 30:
            text = extract_text_from_scanned_pdf(file_path)

        parsed_data = parse_resume_data(text)

        return {
            "success": True,
            "filename": file.filename,
            "data": parsed_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))