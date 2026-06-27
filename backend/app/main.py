from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.redis import init_redis, close_redis

# Ensure uploads directory exists
UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads" / "resumes"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_redis()
    yield
    # Shutdown
    await close_redis()

app = FastAPI(
    title="TalentStream AI",
    description="Automated Hiring Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded resumes as static files
app.mount("/api/v1/uploads/resumes", StaticFiles(directory=str(UPLOADS_DIR)), name="resumes")

# Custom validation error handler for user-friendly messages
FIELD_LABELS = {
    "email": "Email",
    "password": "Password",
    "full_name": "Full Name",
    "role": "Role",
    "company_name": "Company Name",
}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = error.get("loc", [])[-1] if error.get("loc") else "input"
        label = FIELD_LABELS.get(str(field), str(field).replace("_", " ").title())
        msg = error.get("msg", "Invalid value")
        errors.append({"loc": error.get("loc", []), "msg": f"{label}: {msg}", "type": error.get("type", "")})
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )


from app.api.routes import auth, jobs, applications, interviews, users
from app.api.websockets import interview

app.include_router(auth.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(applications.router, prefix="/api/v1")
app.include_router(interviews.router, prefix="/api/v1")
app.include_router(interview.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

