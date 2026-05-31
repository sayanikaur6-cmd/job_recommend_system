from pydantic import BaseModel
from typing import List

class ResumeDataSchema(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str]
    raw_text: str