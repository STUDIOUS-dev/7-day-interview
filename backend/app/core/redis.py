import redis.asyncio as redis
from app.core.config import settings

# Global redis connection pool
redis_client: redis.Redis | None = None


async def init_redis() -> None:
    global redis_client
    # redis.from_url handles both redis:// and rediss:// (TLS for Upstash)
    # ssl_cert_reqs=None disables cert validation for managed cloud Redis
    url = settings.REDIS_URL
    if url.startswith("rediss://"):
        redis_client = redis.from_url(
            url,
            decode_responses=True,
            ssl_cert_reqs=None,
        )
    else:
        redis_client = redis.from_url(url, decode_responses=True)


async def get_redis() -> redis.Redis:
    if not redis_client:
        await init_redis()
    return redis_client  # type: ignore[return-value]


async def close_redis() -> None:
    if redis_client:
        await redis_client.aclose()
