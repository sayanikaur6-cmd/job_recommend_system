from fastapi import APIRouter

from app.schemas.job_chat import (
    JobChatStartRequest,
    JobChatRequest,
    JobChatResponse
)

from app.controllers.job_chat_controller import (
    JobChatController
)


router = APIRouter(
    prefix="/job-chat",
    tags=["Job Recommendation Chatbot"]
)


@router.post(
    "/start",
    response_model=JobChatResponse
)
async def start_job_chat(
    request: JobChatStartRequest
):

    return await (
        JobChatController
        .start_chat(request)
    )


@router.post(
    "/message",
    response_model=JobChatResponse
)
async def send_job_chat_message(
    request: JobChatRequest
):

    return await (
        JobChatController
        .send_message(request)
    )