# CareerSync – AI-Powered Job Recommendation & Career Assistance Platform

CareerSync is a full-stack career assistance platform that combines **React + Vite**, **Node.js + Express**, **MongoDB**, and **Python FastAPI** microservices.

The platform helps users manage their profiles and resumes, discover jobs, receive personalized job recommendations, process resumes with Python-based services, generate PDF resumes, and interact with AI-powered career/job assistance.

---

## 🚀 Main Technologies

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| AI / Microservices | Python + FastAPI |
| AI Service | Groq API |
| Job Data | External Job API |
| Authentication | JWT |
| Resume Processing | Python |
| Resume Output | PDF |
| API Style | RESTful APIs |
| Development | Visual Studio Code |
| Version Control | Git + GitHub |

---

# 📁 Project Structure

```text
job_recommend_system/
│
├── client/                         # React + Vite frontend
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                         # Node.js + Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── python/                         # Python + FastAPI microservices
│   ├── app/
│   │   ├── controllers/
│   │   ├── core/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── chat_service.py
│   │   │   ├── job_chat_service.py
│   │   │   ├── jsearch_service.py
│   │   │   ├── ocr_service.py
│   │   │   ├── ollama_service.py
│   │   │   ├── parser_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── recommendation_service.py
│   │   └── utils/
│   │       └── database.py
│   │
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 💻 System Requirements

Before starting, install the following:

### Required

- Git
- Node.js
- npm
- Python 3.10+
- pip
- MongoDB / MongoDB Atlas account
- A modern web browser
- Visual Studio Code (recommended)

### Optional

- Ollama, if Ollama-based functionality is enabled in your local setup.

Check installations:

```bash
git --version
node --version
npm --version
python --version
pip --version
```

Recommended Node.js: **LTS version**

Recommended Python: **3.10 or newer**

---

# 📥 1. Clone the Repository

Clone the GitHub repository:

```bash
git clone https://github.com/YOUR_USERNAME/job_recommend_system.git
```

Enter the project:

```bash
cd job_recommend_system
```

> Replace `YOUR_USERNAME/job_recommend_system` with the actual GitHub repository URL.

---

# ⚛️ 2. Frontend Setup

Open a terminal inside the project root and run:

```bash
cd client
```

Install all frontend dependencies:

```bash
npm install
```

This installs dependencies from:

```text
client/package.json
client/package-lock.json
```

Create the frontend environment file:

```text
client/.env
```

If `.env.example` is available, copy it:

### Windows CMD

```cmd
copy .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Then update the values according to the project configuration.

Example:

```env
VITE_API_URL=http://localhost:5000
```

> Do not commit `.env` to GitHub if it contains secrets.

Start the frontend:

```bash
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

# 🟢 3. Backend Setup

Open another terminal.

From the project root:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

This installs all packages from:

```text
server/package.json
server/package-lock.json
```

Create:

```text
server/.env
```

If an example file exists:

### Windows CMD

```cmd
copy .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Configure the required environment variables used by the backend.

Typical configuration may look like:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY

# Add the other API credentials required by your project.
# Example:
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GROQ_API_KEY=
# JSEARCH_API_KEY=
# JSEARCH_HOST=
```

**Important:** Use the exact variable names referenced by the current backend source code and `.env.example`.

Start the backend:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

---

# 🐍 4. Python / FastAPI Setup

Open another terminal.

From the project root:

```bash
cd python
```

## Create a virtual environment

### Windows

```cmd
python -m venv .venv
```

Activate it:

```cmd
.venv\Scripts\activate
```

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

After activation, the terminal should show something similar to:

```text
(.venv)
```

---

# 📦 5. Install Python Dependencies

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Install all Python dependencies:

```bash
pip install -r requirements.txt
```

The project uses packages including:

```text
fastapi
uvicorn
ollama
pydantic
python-multipart
pymupdf
pdf2image
pytesseract
pillow
opencv-python
pydantic_settings
openai
httpx
motor
requests
```

---

# 🔐 6. Python Environment Variables

If the Python service uses environment variables, create:

```text
python/.env
```

Example:

```env
# Add the variables required by the FastAPI services.

# MongoDB
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

# Groq / AI
GROQ_API_KEY=YOUR_GROQ_API_KEY

# External Job API
JSEARCH_API_KEY=YOUR_JSEARCH_API_KEY
JSEARCH_HOST=jsearch.p.rapidapi.com
```

Use the exact variable names defined in the project's configuration files.

**Never upload API keys, passwords, JWT secrets, or database credentials to GitHub.**

---

# ▶️ 7. Start FastAPI

From:

```text
job_recommend_system/python
```

run:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If your FastAPI entry file/module is different, use the command defined by the current project.

FastAPI will normally run at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

---

# 🔄 8. Run the Complete Project

CareerSync normally requires **three running services**:

```text
┌──────────────────────────────┐
│ React + Vite                 │
│ localhost:5173               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Node.js + Express            │
│ localhost:5000               │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌────────────────┐
│ MongoDB      │  │ FastAPI        │
│ Database     │  │ localhost:8000 │
└──────────────┘  └────────────────┘
```

### Terminal 1 – Frontend

```bash
cd client
npm install
npm run dev
```

### Terminal 2 – Node.js Backend

```bash
cd server
npm install
npm run dev
```

### Terminal 3 – Python FastAPI

### Windows

```cmd
cd python
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Linux / macOS

```bash
cd python
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

# 🗄️ 9. MongoDB Setup

CareerSync uses MongoDB for application data.

You can use:

- MongoDB Atlas
- Local MongoDB installation

## MongoDB Atlas

Create a MongoDB Atlas cluster and obtain the connection string.

Example format:

```text
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME
```

Put the connection string in the appropriate `.env` file.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/jobrecommend
```

Make sure your MongoDB Atlas Network Access settings allow your development machine to connect.

---

# 🔑 10. API Keys

Some CareerSync features depend on external services.

Depending on the enabled modules, you may need credentials for:

### Groq

Used for AI-powered functionality.

Add the API key to the environment variable expected by the project.

### External Job API

Used for job search and job recommendation data.

The current project can use JSearch/RapidAPI-based job data.

Configure:

```env
JSEARCH_API_KEY=YOUR_API_KEY
JSEARCH_HOST=jsearch.p.rapidapi.com
```

Use the exact variable names expected by the source code.

---

# 📄 11. Resume Processing

The Python services provide functionality for resume-related processing.

The project can use Python libraries such as:

```text
PyMuPDF
pdf2image
pytesseract
Pillow
OpenCV
```

These are used for PDF/document processing and OCR-related functionality.

## OCR note

On some operating systems, `pytesseract` also requires the **Tesseract OCR executable** to be installed separately.

After installing Tesseract, make sure it is available in your system PATH.

Check:

```bash
tesseract --version
```

If the command is not found, install Tesseract for your operating system and add it to PATH.

---

# 🤖 12. AI / Ollama

Some project modules include Ollama integration.

If Ollama functionality is enabled:

1. Install Ollama.
2. Start the Ollama service.
3. Download the model required by the project.

Check:

```bash
ollama --version
```

Then use the model configured by the project.

If the application does not use Ollama for the current workflow, this step can be skipped.

---

# 🧪 13. Check the Services

### Frontend

Open:

```text
http://localhost:5173
```

### Express Backend

Open:

```text
http://localhost:5000
```

### FastAPI

Open:

```text
http://localhost:8000/docs
```

The FastAPI Swagger page is especially useful for testing API endpoints.

---

# 🛠️ 14. Common Problems

## `npm install` fails

Check Node and npm:

```bash
node --version
npm --version
```

Then try:

```bash
npm install
```

Do not delete `package-lock.json` unless you have a specific reason to regenerate dependencies.

---

## Python package installation fails

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Then:

```bash
pip install -r requirements.txt
```

Make sure the virtual environment is activated.

---

## FastAPI command not found

Activate the virtual environment:

### Windows

```cmd
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
```

---

## MongoDB connection error

Check:

1. MongoDB URI
2. Username/password
3. Database name
4. MongoDB Atlas Network Access
5. Internet connection

---

## API key error

Check the relevant `.env` file and make sure:

- The variable name matches the source code.
- The key is valid.
- There are no unnecessary quotation marks/spaces.
- The application was restarted after changing `.env`.

---

## CORS error

Make sure the Express backend is running and that the frontend is using the correct backend URL.

For example:

```env
VITE_API_URL=http://localhost:5000
```

The exact variable depends on the project implementation.

---

# 🔒 15. Environment Variables & Security

Never commit these files:

```text
.env
.env.local
.env.production
```

Never commit:

```text
node_modules/
.venv/
__pycache__/
```

Never expose:

```text
MongoDB passwords
JWT secrets
Groq API keys
RapidAPI keys
Google OAuth secrets
Other private credentials
```

The repository should contain `.env.example` files with placeholder values instead.

Example:

```env
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
JSEARCH_API_KEY=
```

---

# 📌 16. Git Workflow

Create a new feature branch:

```bash
git switch -c feature/job-recommendation
```

Check:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Add job recommendation features"
```

Push:

```bash
git push -u origin feature/job-recommendation
```

---

# 🔄 17. Updating the Project

Before starting new work:

```bash
git pull origin main
```

Install dependencies if `package.json` changed:

```bash
cd client
npm install
```

and:

```bash
cd ../server
npm install
```

For Python:

```bash
cd ../python
pip install -r requirements.txt
```

---

# 👨‍💻 18. Development Workflow

Recommended development order:

```text
1. Start MongoDB / MongoDB Atlas
        ↓
2. Start FastAPI
        ↓
3. Start Express Backend
        ↓
4. Start React Frontend
        ↓
5. Open the application
        ↓
6. Test APIs using Swagger / browser / API client
```

---

# 🌟 19. Core Features

CareerSync is designed as a complete career assistance platform with modules such as:

- User registration and login
- JWT authentication
- User profiles
- Resume upload and processing
- Resume information extraction
- Resume PDF generation
- Job search
- Location-based job search
- Personalized job recommendation
- Skill-based job matching
- External job API integration
- AI-powered career assistance
- AI job chat
- Interview assistance
- Job application tracking
- Saved jobs
- Social/profile features
- Connections
- Posts and interactions
- Python-based document processing
- RESTful API architecture

---

# 📚 20. Useful Commands – Quick Reference

### Clone

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd job_recommend_system
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Python

```bash
cd python
python -m venv .venv
```

Windows:

```cmd
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

# 📝 Important Note for Contributors

Before running the project, always check:

```text
client/.env.example
server/.env.example
python/.env.example
```

if those files exist.

Copy them to `.env` and fill in the required credentials.

Do not commit real credentials.

---

# 🤝 Contributing

1. Fork the repository.
2. Clone your fork.
3. Create a new branch.

```bash
git switch -c feature/your-feature-name
```

4. Make your changes.
5. Test the application.
6. Commit your changes.

```bash
git add .
git commit -m "Describe your changes"
```

7. Push the branch.

```bash
git push -u origin feature/your-feature-name
```

8. Create a Pull Request.

---

# 📄 License

Add the project's chosen license here.

If no license has been selected yet, do not assume that the project is open-source licensed.

---

# 👤 Author

**CareerSync Project**

Built using:

```text
React.js
Node.js
Express.js
MongoDB
Python
FastAPI
Groq API
External Job API
JWT
Git/GitHub
```

---

## ⭐ If you find this project useful

Give the repository a star ⭐ and feel free to contribute improvements.
