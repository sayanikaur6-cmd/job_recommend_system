import requests

from app.core.config import settings


class JSearchService:

    BASE_URL = "https://jsearch.p.rapidapi.com/search"

    async def search_jobs(
        self,
        query: str,
        location: str | None = None,
        num_pages: int = 1
    ):

        headers = {
            "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
            "X-RapidAPI-Host": settings.JSEARCH_HOST
        }

        params = {
            "query": query,
            "page": 1,
            "num_pages": num_pages,
            "country": "in"
        }

        if location:
            params["query"] = f"{query} in {location}"

        response = requests.get(
            self.BASE_URL,
            headers=headers,
            params=params,
            timeout=(10, 90)
        )

        print("JSEARCH STATUS:", response.status_code)
        print("JSEARCH RESPONSE:", response.text[:500])

        response.raise_for_status()    

        data = response.json()

        return data.get("data", [])


jsearch_service = JSearchService()