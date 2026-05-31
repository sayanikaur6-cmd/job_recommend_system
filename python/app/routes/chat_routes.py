from fastapi import APIRouter

from app.schemas.chat_schema import (
    ChatRequest
)

from app.controllers.chat_controller import (
    chat_controller
)

router = APIRouter(
    prefix="/api/chat",
    tags=["Chatbot"]
)


@router.post("/")
async def chat(
    data: ChatRequest
):

    return await chat_controller(
        data
    )