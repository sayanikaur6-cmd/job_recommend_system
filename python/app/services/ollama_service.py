import json
import re
import uuid
from typing import Dict, Any, Tuple
from openai import OpenAI
from app.core.config import settings
from app.core.prompts import SYSTEM_PROMPT, FINAL_EVALUATION_PROMPT

class GroqInterviewService:
    def __init__(self):
        # In-Memory Session Store
        self.sessions: Dict[str, dict] = {}
        
        # Initialize Groq client via OpenAI SDK
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL
        )
        self.model = settings.GROQ_MODEL_NAME

    def start_new_session(self, job_role: str) -> Tuple[str, str]:
        session_id = str(uuid.uuid4())
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Hi, I am ready for the interview for the role of '{job_role}'. Please greet me and ask Question 1 of {settings.MAX_QUESTIONS}."
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
            "job_role": job_role,
            "question_count": 1,
            "messages": messages
        }

        return session_id, ai_reply

    def process_chat(self, session_id: str, user_message: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            raise KeyError("Session not found")

        session_data = self.sessions[session_id]
        messages = session_data["messages"]
        q_count = session_data["question_count"] + 1
        session_data["question_count"] = q_count

        messages.append({"role": "user", "content": user_message})

        # Final Evaluation Check
        if q_count > settings.MAX_QUESTIONS:
            messages.append({"role": "user", "content": FINAL_EVALUATION_PROMPT})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7
            )
            ai_reply = response.choices[0].message.content

            parsed_json = {}
            summary_text = ai_reply

            json_match = re.search(r"```json\s*(\{.*?\})\s*```", ai_reply, re.DOTALL)
            if json_match:
                try:
                    parsed_json = json.loads(json_match.group(1))
                    summary_text = re.sub(r"```json\s*\{.*?\}\s*```", "", ai_reply, flags=re.DOTALL).strip()
                except json.JSONDecodeError:
                    parsed_json = {"error": "Failed to parse model evaluation JSON structure."}

            return {
                "is_complete": True,
                "raw_response": ai_reply,
                "structured_result": parsed_json,
                "text_summary": summary_text
            }

        # Regular Question Processing
        else:
            prompt_modifier = f"\n\n[System Note: This is response to question {q_count - 1}. Evaluate briefly and ask Question {q_count} of {settings.MAX_QUESTIONS}.]"
            messages[-1]["content"] += prompt_modifier

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7
            )
            ai_reply = response.choices[0].message.content
            messages.append({"role": "assistant", "content": ai_reply})

            return {
                "is_complete": False,
                "response": ai_reply,
                "question_number": q_count,
                "max_questions": settings.MAX_QUESTIONS
            }

# Singleton Instance
interview_service = GroqInterviewService()