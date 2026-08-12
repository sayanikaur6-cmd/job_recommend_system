import os
import re
import json
import uuid
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI(title="AI Voice Interview Simulator API")

# React Frontend-এর সাথে কানেক্ট করার জন্য CORS কনফিগারেশন
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production-এ আপনার React app-এর URL দেবেন
    allow_credentials=True,
    allow_methods=["*"],  #[cite: 1]
    allow_headers=["*"],
)

MODEL_NAME = "gemma3"  #[cite: 1]
MAX_QUESTIONS = 5  #[cite: 1]

SYSTEM_PROMPT = f"""
You are an expert technical interviewer conducting a structured, realistic candidate evaluation.
Rules:
1. Ask EXACTLY ONE technical or behavioral question at a time.
2. Evaluate the candidate's previous response in 1-2 brief sentences before moving to the next topic.
3. Adapt follow-up questions based on candidate performance.
4. Keep the interview dynamic and tailored specifically to the given job role.
"""  #[cite: 1]

FINAL_EVALUATION_PROMPT = """
The interview is now complete. Analyze the full candidate response log above and generate a final structured evaluation.

Output Requirements:
1. Provide a single JSON block inside ```json ... ``` code fences containing specific scores (0-100 scale).
2. Follow up with a helpful, structured textual summary (2-3 paragraphs).

JSON Template to follow strictly:
```json
{
  "scores": {
    "confidence": 80,
    "technical": 85,
    "communication": 78,
    "problem_solving": 82,
    "total_score": 81
  },
  "verdict": "Strong Candidate / Consider / Needs Improvement",
  "strengths": ["Clear communication of concepts", "Good algorithm problem solving"],
  "areas_for_improvement": ["Could improve system design depth", "Edge case handling"]
}
Note: Calculate 'total_score' as the average of confidence, technical, communication, and problem_solving.
"""  #[cite: 1]

# In-Memory Session Store
sessions: Dict[str, dict] = {}

class StartRequest(BaseModel):
    role: str = "Software Engineer"  #[cite: 1]

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/start")
async def start_interview(request: StartRequest):
    try:
        session_id = str(uuid.uuid4())  #[cite: 1]
        job_role = request.role

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Hi, I am ready for the interview for the role of '{job_role}'. Please greet me and ask Question 1 of {MAX_QUESTIONS}."}
        ]  #[cite: 1]

        response = ollama.chat(model=MODEL_NAME, messages=messages)  #[cite: 1]
        ai_reply = response["message"]["content"]  #[cite: 1]

        messages.append({"role": "assistant", "content": ai_reply})  #[cite: 1]

        # Save session
        sessions[session_id] = {
            "job_role": job_role,
            "question_count": 1,  #[cite: 1]
            "messages": messages
        }

        return {
            "session_id": session_id,
            "response": ai_reply,
            "question_number": 1,
            "max_questions": MAX_QUESTIONS,
            "is_complete": False
        }  #[cite: 1]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  #[cite: 1]

@app.post("/chat")
async def chat(request: ChatRequest):
    session_id = request.session_id
    user_message = request.message.strip()  #[cite: 1]

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if not user_message:
        raise HTTPException(status_code=400, detail="Empty response received")  #[cite: 1]

    session_data = sessions[session_id]
    messages = session_data["messages"]
    q_count = session_data["question_count"] + 1  #[cite: 1]
    session_data["question_count"] = q_count

    messages.append({"role": "user", "content": user_message})  #[cite: 1]

    try:
        if q_count > MAX_QUESTIONS:  #[cite: 1]
            messages.append({"role": "user", "content": FINAL_EVALUATION_PROMPT})  #[cite: 1]
            response = ollama.chat(model=MODEL_NAME, messages=messages)  #[cite: 1]
            ai_reply = response["message"]["content"]  #[cite: 1]

            parsed_json = {}
            summary_text = ai_reply

            json_match = re.search(r"```json\s*(\{.*?\})\s*```", ai_reply, re.DOTALL)  #[cite: 1]
            if json_match:
                try:
                    parsed_json = json.loads(json_match.group(1))  #[cite: 1]
                    summary_text = re.sub(r"```json\s*\{.*?\}\s*```", "", ai_reply, flags=re.DOTALL).strip()  #[cite: 1]
                except json.JSONDecodeError:
                    parsed_json = {"error": "Failed to parse model evaluation JSON structure."}  #[cite: 1]

            return {
                "is_complete": True,
                "raw_response": ai_reply,
                "structured_result": parsed_json,
                "text_summary": summary_text
            }  #[cite: 1]
        else:
            prompt_modifier = f"\n\n[System Note: This is response to question {q_count - 1}. Evaluate briefly and ask Question {q_count} of {MAX_QUESTIONS}.]"  #[cite: 1]
            messages[-1]["content"] += prompt_modifier  #[cite: 1]

            response = ollama.chat(model=MODEL_NAME, messages=messages)  #[cite: 1]
            ai_reply = response["message"]["content"]  #[cite: 1]

            messages.append({"role": "assistant", "content": ai_reply})  #[cite: 1]

            return {
                "response": ai_reply,
                "question_number": q_count,
                "max_questions": MAX_QUESTIONS,
                "is_complete": False
            }  #[cite: 1]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  #[cite: 1]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)