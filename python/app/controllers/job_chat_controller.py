from fastapi import HTTPException
from app.schemas.job_chat import JobChatStartRequest, JobChatRequest, JobChatResponse
from app.services.job_chat_service import job_chat_service

class JobChatController:

    @staticmethod
    async def start_chat(request: JobChatStartRequest) -> JobChatResponse:
        try:
            session_id, ai_reply = job_chat_service.start_chat_session(request.user_name)
            return JobChatResponse(
                session_id=session_id,
                response=ai_reply
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def send_message(request: JobChatRequest) -> JobChatResponse:
        user_message = request.message.strip()
        if not user_message:
            raise HTTPException(status_code=400, detail="Empty message received")

        try:
            result = job_chat_service.process_user_message(request.session_id, user_message)
            return JobChatResponse(**result)
        except KeyError:
            raise HTTPException(status_code=404, detail="Session not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))