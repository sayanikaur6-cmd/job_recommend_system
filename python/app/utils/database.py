from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from bson import ObjectId


# MongoDB client
client = AsyncIOMotorClient(
    settings.MONGO_URI
)


# CareerSync database
db = client[
    settings.DB_NAME
]


# =========================
# Collections
# =========================

# User collection
users_collection = db["users"]

#Skills collection
skills_collection = db["skills"]

# Chat history
chat_history = db["messages"]

# Optional chatbot dataset
chatbot_dataset = db["chatbot_dataset"]


async def get_user_by_id(user_id: str):

    user = await users_collection.find_one(
        {
            "$or": [
                {"user_id": user_id},
                {"_id": user_id}
            ]
        }
    )

    if not user:
        return None

    skill_ids = user.get("skills", [])

    if skill_ids:

        skill_docs = await skills_collection.find(
            {
                "_id": {
                    "$in": skill_ids
                }
            }
        ).to_list(length=None)

        user["skills"] = [
            skill_doc["skill"]
            for skill_doc in skill_docs
            if skill_doc.get("skill")
        ]

    else:
        user["skills"] = []

    return user