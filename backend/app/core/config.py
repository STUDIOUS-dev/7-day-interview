"""
Application settings loaded from environment variables.

Priority (highest → lowest):
  1. Actual environment variables (Render dashboard / Vercel / CI)
  2. .env.production  (when ENVIRONMENT=production, loaded from disk — gitignored)
  3. .env.development (when ENVIRONMENT=development, loaded from disk — gitignored)
  4. Defaults defined below

Startup will FAIL with a clear error message if any required production
variable is missing.
"""

import os
import sys
import warnings
from pathlib import Path
from typing import Literal

from pydantic import computed_field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

if ENVIRONMENT == "production":
    _ENV_FILE = BACKEND_DIR / ".env.production"
else:
    _ENV_FILE = BACKEND_DIR / ".env.development"


class Settings(BaseSettings):
    # ── Core ────────────────────────────────────────────────────────────────
    ENVIRONMENT: Literal["development", "production"] = "development"

    # ── Database (Supabase PostgreSQL / local) ──────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://talentstream:password@localhost:5432/talentstream"

    # ── Redis (Upstash rediss:// in prod, redis:// in dev) ─────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # Upstash HTTP REST client (alternative to raw Redis protocol)
    UPSTASH_REDIS_REST_URL: str = ""
    UPSTASH_REDIS_REST_TOKEN: str = ""

    # ── Auth / JWT ──────────────────────────────────────────────────────────
    SECRET_KEY: str | None = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ── Google / Gemini ─────────────────────────────────────────────────────
    GOOGLE_API_KEY: str = ""

    # ── Supabase ────────────────────────────────────────────────────────────
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""               # anon/public key (optional)
    SUPABASE_SERVICE_ROLE_KEY: str = ""       # server-side privileged key
    SUPABASE_STORAGE_BUCKET: str = "resumes"
    SUPABASE_STORAGE_BUCKET_PUBLIC: bool = False

    # ── App behaviour ───────────────────────────────────────────────────────
    ATS_SCORE_THRESHOLD: int = 65
    FRONTEND_URL: str = "http://localhost:5173"  # override in prod

    # ── Observability (optional) ─────────────────────────────────────────────
    SENTRY_DSN: str = ""
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Computed helpers ────────────────────────────────────────────────────

    @computed_field  # type: ignore[prop-decorator]
    @property
    def CORS_ORIGINS(self) -> list[str]:
        """Allowed CORS origins based on environment."""
        dev_origins = ["http://localhost:5173", "http://localhost:3000"]
        prod_origins = [
            self.FRONTEND_URL,
            "https://seven-day-interview.onrender.com",
        ]
        if self.ENVIRONMENT == "production":
            return list({*dev_origins, *prod_origins})  # deduplicated
        return dev_origins

    # ── Backward compatibility ──────────────────────────────────────────────

    @model_validator(mode="after")
    def _migrate_legacy_supabase_key(self) -> "Settings":
        """Map deprecated SUPABASE_KEY → SUPABASE_ANON_KEY."""
        legacy = os.getenv("SUPABASE_KEY", "")
        if legacy and not self.SUPABASE_ANON_KEY:
            warnings.warn(
                "SUPABASE_KEY is deprecated — rename to SUPABASE_ANON_KEY",
                DeprecationWarning,
                stacklevel=2,
            )
            self.SUPABASE_ANON_KEY = legacy
        return self

    # ── Startup validation ──────────────────────────────────────────────────

    @model_validator(mode="after")
    def validate_required_production_vars(self) -> "Settings":
        if self.ENVIRONMENT != "production":
            return self

        required: dict[str, str] = {
            "SECRET_KEY": self.SECRET_KEY or "",
            "DATABASE_URL": self.DATABASE_URL,
            "REDIS_URL": self.REDIS_URL,
            "GOOGLE_API_KEY": self.GOOGLE_API_KEY,
            "SUPABASE_URL": self.SUPABASE_URL,
            "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_ROLE_KEY,
        }

        missing = [k for k, v in required.items() if not v]
        if missing:
            print(  # noqa: T201 — printed before logging is configured
                "\n[FATAL] Missing required environment variables for production:\n"
                + "\n".join(f"  - {k}" for k in missing)
                + "\n\nSet these in the Render dashboard (or your .env.production file).\n",
                file=sys.stderr,
            )
            raise ValueError(f"Missing required env vars: {', '.join(missing)}")

        return self


settings = Settings()
