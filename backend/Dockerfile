# ─────────────────────────────────────────────────────────────────────────────
# Production Dockerfile — Python 3.12 slim, non-root user
# ─────────────────────────────────────────────────────────────────────────────

# Build stage — install dependencies
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build tools for any C-extension packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a local prefix so we can copy them
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ─────────────────────────────────────────────────────────────────────────────
# Runtime stage — minimal image
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Runtime libs only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /install /usr/local

WORKDIR /app

# Copy application code
COPY . .

# Ensure prestart script is executable
RUN chmod +x prestart.sh

# Create a non-root user for security
RUN groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# prestart.sh runs Alembic migrations, then starts uvicorn
CMD ["bash", "-c", "./prestart.sh && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
