import os
import httpx

from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3"


async def fetch_youtube_resources(
    query,
    resource_type="video",
    max_results=2
):
    if not YOUTUBE_API_KEY or not query:
        return []

    params = {
        "part": "snippet",
        "q": query,
        "type": resource_type,
        "maxResults": max_results,
        "order": "relevance",
        "relevanceLanguage": "en",
        "safeSearch": "strict",
        "key": YOUTUBE_API_KEY
    }

    if resource_type == "video":
        params["videoEmbeddable"] = "true"
        params["videoSyndicated"] = "true"

    try:
        async with httpx.AsyncClient(timeout=15) as client:

            response = await client.get(
                f"{YOUTUBE_BASE_URL}/search",
                params=params
            )

            response.raise_for_status()

            data = response.json()

        resources = []

        for item in data.get("items", []):

            snippet = item.get("snippet", {})
            resource_id = item.get("id", {})

            thumbnails = snippet.get("thumbnails", {})

            thumbnail = (
                thumbnails.get("high", {}).get("url")
                or thumbnails.get("medium", {}).get("url")
                or thumbnails.get("default", {}).get("url")
            )

            if resource_type == "video":

                video_id = resource_id.get("videoId")

                if not video_id:
                    continue

                resource = {
                    "title": snippet.get("title"),
                    "type": "video",
                    "platform": "YouTube",
                    "video_id": video_id,
                    "channel_name": snippet.get("channelTitle"),
                    "description": snippet.get("description"),
                    "thumbnail": thumbnail,
                    "url": (
                        f"https://www.youtube.com/watch?v={video_id}"
                    ),
                    "embed_url": (
                        f"https://www.youtube-nocookie.com/embed/{video_id}"
                    ),
                    "is_verified": True
                }

            else:

                playlist_id = resource_id.get("playlistId")

                if not playlist_id:
                    continue

                resource = {
                    "title": snippet.get("title"),
                    "type": "playlist",
                    "platform": "YouTube",
                    "playlist_id": playlist_id,
                    "channel_name": snippet.get("channelTitle"),
                    "description": snippet.get("description"),
                    "thumbnail": thumbnail,
                    "url": (
                        "https://www.youtube.com/playlist"
                        f"?list={playlist_id}"
                    ),
                    "embed_url": (
                        "https://www.youtube-nocookie.com/embed/videoseries"
                        f"?list={playlist_id}"
                    ),
                    "is_verified": True
                }

            resources.append(resource)

        return resources

    except httpx.HTTPError as error:

        print(
            "YouTube API request failed:",
            type(error).__name__
        )

        return []


async def enrich_evaluation_with_youtube(evaluation):

    weak_topics = evaluation.get("weak_topics", [])

    used_resources = set()

    for topic in weak_topics:

        topic_name = topic.get("topic", "")

        search_data = topic.get("resource_search", {})

        video_query = search_data.get(
            "video_query",
            f"{topic_name} interview tutorial"
        )

        playlist_query = search_data.get(
            "playlist_query",
            f"{topic_name} complete course playlist"
        )

        videos = await fetch_youtube_resources(
            query=video_query,
            resource_type="video",
            max_results=2
        )

        playlists = await fetch_youtube_resources(
            query=playlist_query,
            resource_type="playlist",
            max_results=1
        )

        recommendations = []

        for resource in videos + playlists:

            resource_url = resource["url"]

            if resource_url not in used_resources:

                recommendations.append(resource)

                used_resources.add(resource_url)

        topic["recommended_resources"] = recommendations

        topic["resource_status"] = (
            "available" if recommendations else "unavailable"
        )

        topic.pop("resource_search", None)

    return evaluation