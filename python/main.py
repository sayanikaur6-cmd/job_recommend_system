from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import interview_routes, job_chat_routes # 🛠️ Import added

app = FastAPI(title="AI Career Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing Interview Routes
app.include_router(interview_routes.router)

# 🛠️ New Job Chatbot Routes Added
app.include_router(job_chat_routes.router)

@app.get("/")
def read_root():
    return {"message": "AI System API is running successfully"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)