import re
IGNORE_WORDS = {
    "contact us", "phone", "email", "address", "website",
    "language", "skill", "skills", "about me", "education",
    "experience", "project", "projects"
}

KNOWN_SKILLS = [
    "Python", "Java", "C++", "JavaScript", "React",
    "Node.js", "Express.js", "MongoDB", "MySQL", "FastAPI",
    "Django", "Flask", "HTML", "CSS", "Bootstrap", "Tailwind",
    "Microservices", "Agile", "Azure", "Functional Programming",
    "PHP"
]
def extract_email(text: str):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else ""

def extract_phone(text: str):
    match = re.search(r'(\+91[-\s]?)?[6-9]\d{9}', text)
    return match.group(0) if match else ""

def is_probable_name(line: str) -> bool:
    line = line.strip()

    if not line:
        return False

    if line.lower() in IGNORE_WORDS:
        return False

    if any(skill.lower() == line.lower() for skill in KNOWN_SKILLS):
        return False

    if "@" in line:
        return False

    if re.search(r'\d', line):
        return False

    if re.search(r'[^A-Za-z.\s]', line):
        return False

    words = line.split()
    if len(words) < 2 or len(words) > 4:
        return False

    return True


def extract_name(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    # Step 1: About Me এর আগে all-caps name খুঁজি
    for i, line in enumerate(lines[:30]):
        if line.lower() == "about me" and i > 0:
            prev_line = lines[i - 1].strip()
            if is_probable_name(prev_line):
                return prev_line.title()

    # Step 2: all caps candidate prefer কর
    for line in lines[:30]:
        if is_probable_name(line) and line == line.upper():
            return line.title()

    # Step 3: fallback normal probable name
    for line in lines[:30]:
        if is_probable_name(line):
            return line.title()

    return ""


def extract_skills(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    found = []

    in_skill_section = False
    skill_lines = []

    stop_words = {"about me", "education", "experience", "project", "projects"}

    for line in lines:
        lower = line.lower()

        if lower in {"skill", "skills"}:
            in_skill_section = True
            continue

        if in_skill_section and lower in stop_words:
            break

        if in_skill_section:
            skill_lines.append(line)

    skill_text = "\n".join(skill_lines)

    for skill in KNOWN_SKILLS:
        pattern = r'(?<![A-Za-z0-9])' + re.escape(skill) + r'(?![A-Za-z0-9])'
        if re.search(pattern, skill_text, re.IGNORECASE):
            found.append(skill)

    return list(dict.fromkeys(found))