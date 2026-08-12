from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class JobChatStartRequest(BaseModel):
    user_name: Optional[str] = "Candidate"

class JobChatRequest(BaseModel):
    session_id: str
    message: str

class JobChatResponse(BaseModel):
    session_id: str
    response: str
    is_recommendation_ready: bool = False