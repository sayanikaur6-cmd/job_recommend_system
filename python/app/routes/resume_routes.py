from fastapi import APIRouter, UploadFile, File
from app.controllers.resume_controller import parse_resume_controller

router = APIRouter()

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    return await parse_resume_controller(file)