# TalentStream AI

TalentStream AI is an automated hiring platform that uses Artificial Intelligence to screen candidates, conduct initial technical interviews, and streamline the recruitment process.

## Features

- **For Recruiters:**
  - Post jobs with required skills and ATS threshold scores.
  - Automatically parse resumes (PDF) and receive AI-generated candidate summaries.
  - View candidate match scores and AI interview transcripts.
  - Shortlist or reject candidates with a single click.

- **For Candidates:**
  - Browse open job postings.
  - Apply with a PDF resume.
  - Participate in an automated AI-driven technical screening interview directly in the browser (via WebSockets).

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (v3 with custom tokens), Framer Motion, Zustand, React Router v6, Radix UI primitives.
- **Backend:** FastAPI, PostgreSQL (asyncpg), SQLAlchemy, Alembic, Redis (caching), WebSockets.
- **AI Integrations:** Google Gemini 1.5 Flash (ATS Scoring) and Gemini 1.5 Pro (Conversational Interviewer).
- **Other:** PyMuPDF (resume parsing), passlib & python-jose (JWT Auth).

## Prerequisites

- Node.js (v18+)
- Python (3.11+)
- Docker & Docker Compose (for PostgreSQL and Redis)
- Google Gemini API Key

## Setup & Installation

### 1. Database & Cache
Run the docker-compose file to start PostgreSQL and Redis:
```bash
cd backend
docker-compose up -d
```

### 2. Backend
```bash
cd backend
python -m venv venv
# Activate the virtual environment:
# Windows: .\venv\Scripts\activate
# Unix: source venv/bin/activate

pip install -r requirements.txt # (Or install packages listed in backend setup)

# Setup Environment Variables
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY and SECRET_KEY

# Run migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend at `http://localhost:8000`.

## Architecture Overview

1. **Authentication:** JWT-based stateless auth.
2. **ATS Engine:** When a candidate uploads a PDF resume, `PyMuPDF` extracts the text. A background task sends the text + job requirements to Gemini 1.5 Flash to generate an ATS score and summary.
3. **AI Interviewer:** If the candidate passes the ATS threshold, they enter an `InterviewRoom`. The frontend connects to the backend via WebSockets. The backend maintains a conversational session with Gemini 1.5 Pro, acting as a technical recruiter.
4. **Caching:** Redis is used to cache public job listings to reduce database load.

## License

MIT License
