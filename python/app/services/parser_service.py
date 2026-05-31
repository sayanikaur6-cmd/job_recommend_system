from app.utils.regex_extractors import extract_email, extract_phone, extract_name, extract_skills

def parse_resume_data(text: str):
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "raw_text": text
    }