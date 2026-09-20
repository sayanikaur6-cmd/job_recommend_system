import uuid
from typing import Dict, Any, Tuple

from openai import OpenAI

from app.core.config import settings
from app.core.prompts import JOB_CHATBOT_SYSTEM_PROMPT

from app.utils.database import get_user_by_id

from app.services.jsearch_service import (
    jsearch_service
)

from app.services.recommendation_service import (
    recommendation_service
)


class JobChatService:

    def __init__(self):

        # In-memory chat sessions
        self.sessions: Dict[str, dict] = {}

        # Groq client
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL
        )

        self.model = settings.GROQ_MODEL_NAME


    # =====================================================
    # USER PROFILE
    # =====================================================

    async def get_user_profile(
        self,
        user_id: str
    ):

        user = await get_user_by_id(
            user_id
        )

        if not user:

            raise ValueError(
                "CareerSync user not found"
            )

        return user


    # =====================================================
    # JOB SEARCH
    # =====================================================

    async def search_jobs_for_user(
        self,
        user_id: str,
        query: str,
        location: str | None = None
    ):

        # Get user
        user = await self.get_user_profile(
            user_id
        )

        # Extract skills
        skills = (
            recommendation_service
            .extract_user_skills(user)
        )

        # If query empty, use user's skills
        if not query.strip():

            if skills:

                query = " ".join(
                    skills[:5]
                )

            else:

                query = "software developer"


        # JSearch
        jobs = await (
            jsearch_service.search_jobs(
                query=query,
                location=location
            )
        )

        # Rank jobs
        recommended = (
            recommendation_service.rank_jobs(
                user_skills=skills,
                jobs=jobs,
                limit=5
            )
        )

        return {
            "user": user,
            "skills": skills,
            "jobs": recommended
        }


    # =====================================================
    # START CHAT
    # =====================================================

    async def start_chat_session(
        self,
        user_id: str,
        user_name: str
    ) -> Tuple[str, str]:

        session_id = str(
            uuid.uuid4()
        )

        # Get profile
        user = await self.get_user_profile(
            user_id
        )

        skills = (
            recommendation_service
            .extract_user_skills(user)
        )

        profile_context = f"""
Candidate Name:
{user_name}

Candidate Skills:
{", ".join(skills)}

You are connected to the CareerSync job recommendation system.

The backend can access the candidate's MongoDB profile and JSearch live job API.
Do not claim that you cannot access jobs.
"""

        messages = [

            {
                "role": "system",
                "content": (
                    JOB_CHATBOT_SYSTEM_PROMPT
                    + "\n"
                    + profile_context
                )
            },

            {
                "role": "user",
                "content": (
                    f"Hi, I am {user_name}. "
                    "Help me find suitable jobs."
                )
            }
        ]

        response = self.client.chat.completions.create(

            model=self.model,

            messages=messages,

            temperature=0.7
        )

        ai_reply = (
            response
            .choices[0]
            .message
            .content
        )

        messages.append(
            {
                "role": "assistant",
                "content": ai_reply
            }
        )

        self.sessions[session_id] = {

            "user_id": user_id,

            "user_name": user_name,

            "messages": messages
        }

        return session_id, ai_reply


    # =====================================================
    # MESSAGE
    # =====================================================

    async def process_user_message(
        self,
        session_id: str,
        user_id: str,
        message: str
    ) -> Dict[str, Any]:

        if session_id not in self.sessions:

            raise KeyError(
                "Session not found"
            )

        session_data = (
            self.sessions[session_id]
        )

        messages = session_data["messages"]

        messages.append(
            {
                "role": "user",
                "content": message
            }
        )

        # ==========================================
        # Get candidate profile
        # ==========================================

        user = await self.get_user_profile(
            user_id
        )

        skills = (
            recommendation_service
            .extract_user_skills(user)
        )

        # ==========================================
        # Ask Groq what user wants
        # ==========================================

        intent_prompt = f"""
Analyze this job chatbot message.

User message:
{message}

Return ONLY JSON:

{{
    "needs_job_search": true,
    "query": "",
    "location": ""
}}

Rules:

- needs_job_search = true when user asks to find,
  search, recommend, show or suggest jobs.

- query should contain the job role/technology.

- location should contain requested location.

- If location is not mentioned, use empty string.

Example:

Message:
"show me React developer jobs in Kolkata"

Return:

{{
    "needs_job_search": true,
    "query": "React Developer",
    "location": "Kolkata"
}}
"""

        intent_response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content": intent_prompt
                }
            ],

            temperature=0
        )

        intent_text = (
            intent_response
            .choices[0]
            .message
            .content
        )

        # ==========================================
        # Try parsing intent
        # ==========================================

        import json

        try:

            clean_text = (
                intent_text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            intent = json.loads(
                clean_text
            )

        except Exception:

            intent = {
                "needs_job_search": False,
                "query": "",
                "location": ""
            }

        # ==========================================
        # JOB SEARCH REQUIRED
        # ==========================================

        if intent.get(
            "needs_job_search"
        ):

            query = (
                intent.get("query")
                or ""
            )

            location = (
                intent.get("location")
                or ""
            )

            job_data = await (
                self.search_jobs_for_user(
                    user_id=user_id,
                    query=query,
                    location=location
                )
            )

            jobs = job_data["jobs"]

            # ======================================
            # Send real jobs to Groq
            # ======================================

            jobs_text = json.dumps(
                jobs,
                indent=2,
                ensure_ascii=False
            )

            recommendation_prompt = f"""
You are CareerSync's AI Job Recommendation Assistant.

Candidate skills:
{", ".join(skills)}

User request:
{message}

The following jobs were retrieved LIVE from JSearch by the backend:

{jobs_text}

IMPORTANT:
- Only recommend jobs from the supplied list.
- Do not invent jobs.
- Do not invent companies.
- Do not invent salary.
- Mention match score.
- Mention matched skills.
- Include apply link when available.
- If no jobs are found, clearly say no matching jobs were found.
- Keep response concise and useful.
"""

            final_response = (
                self.client
                .chat.completions.create(

                    model=self.model,

                    messages=[
                        {
                            "role": "system",
                            "content": (
                                JOB_CHATBOT_SYSTEM_PROMPT
                            )
                        },

                        {
                            "role": "user",
                            "content": (
                                recommendation_prompt
                            )
                        }
                    ],

                    temperature=0.4
                )
            )

            ai_reply = (
                final_response
                .choices[0]
                .message
                .content
            )

            messages.append(
                {
                    "role": "assistant",
                    "content": ai_reply
                }
            )

            return {

                "session_id": session_id,

                "response": ai_reply,

                "is_recommendation_ready": True
            }

        # ==========================================
        # NORMAL CHAT
        # ==========================================

        messages.append(
            {
                "role": "system",
                "content": f"""
Current CareerSync user profile:

User ID:
{user_id}

Skills:
{", ".join(skills)}

Use this information when answering the candidate.
"""
            }
        )

        response = (
            self.client
            .chat.completions.create(

                model=self.model,

                messages=messages,

                temperature=0.7
            )
        )

        ai_reply = (
            response
            .choices[0]
            .message
            .content
        )

        messages.append(
            {
                "role": "assistant",
                "content": ai_reply
            }
        )

        return {

            "session_id": session_id,

            "response": ai_reply,

            "is_recommendation_ready": False
        }


job_chat_service = JobChatService()