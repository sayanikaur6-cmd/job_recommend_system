from fastapi import APIRouter
from app.schemas.interview import StartRequest, ChatRequest, StartResponse, ChatResponse
from app.controllers.interview_controller import InterviewController

router = APIRouter(prefix="/interview", tags=["Interview"])

@router.post("/start", response_model=StartResponse)
async def start_interview(request: StartRequest):
    return await InterviewController.start_interview(request)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return await InterviewController.handle_chat(request)