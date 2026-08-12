import uuid
from typing import Dict, Any, Tuple
from openai import OpenAI
from app.core.config import settings
from app.core.prompts import JOB_CHATBOT_SYSTEM_PROMPT

class JobChatService:
    def __init__(self):
        # In-Memory Session Store
        self.sessions: Dict[str, dict] = {}
        
        # Initialize Groq client via OpenAI SDK
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL
        )
        self.model = settings.GROQ_MODEL_NAME

    def start_chat_session(self, user_name: str) -> Tuple[str, str]:
        session_id = str(uuid.uuid4())
        messages = [
            {"role": "system", "content": JOB_CHATBOT_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Hi, I am {user_name}. Help me find suitable jobs based on my profile."
            }
        ]

        # Call Groq API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7
        )
        ai_reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": ai_reply})

        self.sessions[session_id] = {
            "user_name": user_name,
            "messages": messages
        }

        return session_id, ai_reply

    def process_user_message(self, session_id: str, message: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            raise KeyError("Session not found")

        session_data = self.sessions[session_id]
        messages = session_data["messages"]

        messages.append({"role": "user", "content": message})

        # Call Groq API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7
        )
        ai_reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": ai_reply})

        return {
            "session_id": session_id,
            "response": ai_reply
        }

# Singleton Instance
job_chat_service = JobChatService()