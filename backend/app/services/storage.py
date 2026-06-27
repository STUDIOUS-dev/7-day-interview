import uuid
import os
from pathlib import Path
from fastapi import UploadFile

# Store resumes locally in the backend/uploads/resumes directory
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

async def upload_resume(file: UploadFile, candidate_id: uuid.UUID, job_id: uuid.UUID) -> str:
    """Save resume PDF to local filesystem and return a URL served by FastAPI."""
    content = await file.read()
    
    # Create a directory structure: uploads/resumes/{candidate_id}/{job_id}/
    file_dir = UPLOAD_DIR / str(candidate_id) / str(job_id)
    file_dir.mkdir(parents=True, exist_ok=True)
    
    # Sanitize filename and save
    safe_name = file.filename.replace(" ", "_") if file.filename else "resume.pdf"
    file_path = file_dir / safe_name
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return a URL path that FastAPI will serve via /api/v1/uploads/resumes/...
    relative_path = f"{candidate_id}/{job_id}/{safe_name}"
    return f"/api/v1/uploads/resumes/{relative_path}"
