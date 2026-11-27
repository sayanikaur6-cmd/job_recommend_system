from fastapi import APIRouter

from app.schemas.interview import (
    StartRequest,
    ChatRequest,
    StartResponse,
    ChatResponse
)

from app.controllers.interview_controller import InterviewController

from app.services.youtube_service import (
    enrich_evaluation_with_youtube
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.post("/start", response_model=StartResponse)
async def start_interview(request: StartRequest):

    return await InterviewController.start_interview(request)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    result = await InterviewController.handle_chat(request)

    if hasattr(result, "model_dump"):
        result = result.model_dump()

    if result.get("is_complete"):

        structured_result = result.get("structured_result")

        if hasattr(structured_result, "model_dump"):
            structured_result = structured_result.model_dump()

        if isinstance(structured_result, dict):

            structured_result = await enrich_evaluation_with_youtube(
                structured_result
            )

            result["structured_result"] = structured_result

    return result