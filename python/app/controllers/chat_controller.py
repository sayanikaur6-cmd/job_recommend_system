from app.services.chat_service import (
    process_chat
)


async def chat_controller(data):
    result = await process_chat(
        data.user_id,
        data.message
    )

    return {
        "success": True,
        "reply": result["reply"],
        "intent": result.get("intent"),
        "category": result.get("category"),
        "score": result.get("score"),
        "method": result.get("method")
    }