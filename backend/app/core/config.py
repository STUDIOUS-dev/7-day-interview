from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://talentstream:password@localhost:5432/talentstream"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "supersecretkeythatyoushouldchange"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    GOOGLE_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    ATS_SCORE_THRESHOLD: int = 65

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
