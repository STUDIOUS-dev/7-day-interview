from app.models.base import Base

# We will import all other models here so alembic can find them automatically
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview
