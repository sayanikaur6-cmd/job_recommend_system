from typing import Dict, Any, Optional
from pydantic import BaseModel

class StartRequest(BaseModel):
    role: str = "Software Engineer"

class ChatRequest(BaseModel):
    session_id: str
    message: str

class StartResponse(BaseModel):
    session_id: str
    response: str
    question_number: int
    max_questions: int
    is_complete: bool

class ChatResponse(BaseModel):
    is_complete: bool
    response: Optional[str] = None
    question_number: Optional[int] = None
    max_questions: Optional[int] = None
    raw_response: Optional[str] = None
    structured_result: Optional[Dict[str, Any]] = None
    text_summary: Optional[str] = None