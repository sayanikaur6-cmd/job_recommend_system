from typing import Optional

from pydantic import BaseModel


class JobChatStartRequest(BaseModel):

    user_id: int

    user_name: Optional[str] = "Candidate"


class JobChatRequest(BaseModel):

    session_id: str

    user_id: int

    message: str


class JobChatResponse(BaseModel):

    session_id: str

    response: str

    is_recommendation_ready: bool = False