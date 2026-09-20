from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str = "CareerSync API"

    ENVIRONMENT: str = "development"

    DEBUG: bool = True

    HOST: str = "0.0.0.0"

    PORT: int = 8000

    ALLOWED_ORIGINS: List[str] = ["*"]

    # =========================
    # Groq
    # =========================

    GROQ_API_KEY: str

    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    GROQ_MODEL_NAME: str = "openai/gpt-oss-20b"

    # =========================
    # MongoDB
    # =========================

    MONGO_URI: str

    DB_NAME: str = "jobrecommend"

    # =========================
    # JSearch
    # =========================

    JSEARCH_API_KEY: str

    JSEARCH_HOST: str = "jsearch.p.rapidapi.com"

    # =========================
    # Other
    # =========================

    DATABASE_URL: str = "sqlite:///./app.db"

    UPLOAD_DIR: str = "uploads"

    MAX_FILE_SIZE_MB: int = 10

    class Config:

        env_file = ".env"

        env_file_encoding = "utf-8"

        extra = "ignore"


settings = Settings()