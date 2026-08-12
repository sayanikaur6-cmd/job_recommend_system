from fastapi import HTTPException
from app.schemas.interview import StartRequest, ChatRequest, StartResponse, ChatResponse
from app.services.ollama_service import interview_service
from app.core.config import settings

class InterviewController:
    
    @staticmethod
    async def start_interview(request: StartRequest) -> StartResponse:
        try:
            session_id, ai_reply = interview_service.start_new_session(request.role)
            return StartResponse(
                session_id=session_id,
                response=ai_reply,
                question_number=1,
                max_questions=settings.MAX_QUESTIONS,
                is_complete=False
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def handle_chat(request: ChatRequest) -> ChatResponse:
        user_message = request.message.strip()
        if not user_message:
            raise HTTPException(status_code=400, detail="Empty response received")

        try:
            result = interview_service.process_chat(request.session_id, user_message)
            return ChatResponse(**result)
        except KeyError:
            raise HTTPException(status_code=404, detail="Session not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))