from datetime import datetime
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.database import chatbot_dataset, chat_history

dataset_cache = []
vectorizer = None
question_vectors = None


def clean(text: str):
    text = str(text).lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


async def load_dataset_cache():
    global dataset_cache, vectorizer, question_vectors

    if dataset_cache and vectorizer is not None and question_vectors is not None:
        return

    dataset_cache = []

    cursor = chatbot_dataset.find(
        {},
        {
            "user_query": 1,
            "bot_response": 1,
            "intent": 1,
            "category": 1
        }
    )

    async for item in cursor:
        if item.get("user_query") and item.get("bot_response"):
            dataset_cache.append(item)

    questions = [clean(item["user_query"]) for item in dataset_cache]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=50000
    )

    question_vectors = vectorizer.fit_transform(questions)

    print(f"Chatbot cache loaded: {len(dataset_cache)} records")


async def save_chat(user_id, message, reply, intent=None, score=0):
    await chat_history.insert_one({
        "user_id": user_id,
        "message": message,
        "reply": reply,
        "intent": intent,
        "score": score,
        "created_at": datetime.utcnow()
    })


async def get_reply(message):
    await load_dataset_cache()

    if not dataset_cache:
        return {
            "reply": "Dataset empty. Please import dataset first.",
            "intent": None,
            "category": None,
            "score": 0,
            "method": "none"
        }

    user_vector = vectorizer.transform([clean(message)])

    scores = cosine_similarity(
        user_vector,
        question_vectors
    )

    best_index = scores.argmax()
    best_score = float(scores[0][best_index])

    if best_score >= 0.20:
        matched = dataset_cache[best_index]

        return {
            "reply": matched.get("bot_response"),
            "intent": matched.get("intent"),
            "category": matched.get("category"),
            "score": best_score,
            "method": "NLP + ML TF-IDF"
        }

    return {
        "reply": "Sorry ami eta bujhte parini. Tumi job, resume, interview, profile ba career niye question korte paro.",
        "intent": None,
        "category": None,
        "score": best_score,
        "method": "NLP + ML TF-IDF"
    }


async def process_chat(user_id, message):
    result = await get_reply(message)

    await save_chat(
        user_id=user_id,
        message=message,
        reply=result["reply"],
        intent=result.get("intent"),
        score=result.get("score")
    )

    return result