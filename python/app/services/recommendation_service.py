import re


class RecommendationService:

    @staticmethod
    def normalize_skill(skill) -> str:
        if skill is None:
            return ""

        skill = str(skill)

        return re.sub(
            r"[^a-zA-Z0-9+#.]",
            "",
            skill.lower()
        ).strip()


    @classmethod
    def extract_user_skills(cls, user: dict):

        skills = user.get("skills", [])

        if isinstance(skills, str):

            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

        normalized = []

        for skill in skills:

            if isinstance(skill, dict):

                skill = (
                    skill.get("name")
                    or skill.get("skill")
                    or ""
                )

            if skill:

                normalized.append(
                    cls.normalize_skill(skill)
                )

        return normalized


    @classmethod
    def calculate_match_score(
        cls,
        user_skills: list,
        job: dict
    ):

        user_skills = set(
            cls.normalize_skill(skill)
            for skill in user_skills
        )

        job_text = " ".join(
            [
                str(job.get("job_title", "")),
                str(job.get("job_description", "")),
                str(job.get("job_required_skills", "")),
            ]
        ).lower()

        matched_skills = []

        for skill in user_skills:

            if skill and skill in job_text:

                matched_skills.append(skill)

        if not user_skills:

            score = 0

        else:

            score = int(
                (
                    len(matched_skills)
                    / len(user_skills)
                ) * 100
            )

        return score, matched_skills


    @classmethod
    def rank_jobs(
        cls,
        user_skills: list,
        jobs: list,
        limit: int = 5
    ):

        results = []

        for job in jobs:

            score, matched_skills = (
                cls.calculate_match_score(
                    user_skills,
                    job
                )
            )

            results.append(
                {
                    "job_id": job.get("job_id"),

                    "title": job.get(
                        "job_title"
                    ),

                    "company": job.get(
                        "employer_name"
                    ),

                    "location": job.get(
                        "job_city"
                    ),

                    "state": job.get(
                        "job_state"
                    ),

                    "country": job.get(
                        "job_country"
                    ),

                    "description": job.get(
                        "job_description",
                        ""
                    )[:1000],

                    "apply_link": job.get(
                        "job_apply_link"
                    ),

                    "match_score": score,

                    "matched_skills": matched_skills
                }
            )

        results.sort(
            key=lambda x: x["match_score"],
            reverse=True
        )

        return results[:limit]


recommendation_service = RecommendationService()