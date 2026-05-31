from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.resume_routes import (
    router as resume_router
)

from app.routes.chat_routes import (
    router as chat_router
)

from app.utils.database import (
    chatbot_dataset
)

app = FastAPI(
    title="CareerSync API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resume Parser
app.include_router(
    resume_router,
    prefix="/api/resume",
    tags=["Resume"]
)

# Chatbot
app.include_router(
    chat_router
)


@app.get("/")
async def home():

    return {
        "message":
        "CareerSync API Running"
    }


@app.get("/test")
async def test():

    total = await chatbot_dataset.count_documents(
        {}
    )

    return {

        "mongo": True,

        "dataset": total

    }