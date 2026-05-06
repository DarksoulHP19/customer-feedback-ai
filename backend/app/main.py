import uuid
import logging
import time
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.models.schemas import (
    FeedbackRequest, FeedbackResponse,
    BatchFeedbackRequest, BatchFeedbackResponse, BatchItemResult,
)
from app.agents.sentiment import analyze_sentiment
from app.agents.clustering import cluster_topics
from app.agents.urgency import classify_urgency
from app.agents.insights import generate_insights
from app.utils.cache import feedback_cache

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

_start_time = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.utils.llm import client  # noqa — triggers env validation
    logger.info("✅ Environment validated — OPENAI_API_KEY present")
    logger.info("🚀 Customer Feedback AI v2.1.0 starting up")
    yield
    logger.info("🛑 Shutting down | Cache stats: %s", feedback_cache.stats)


app = FastAPI(
    title="Customer Feedback AI",
    description="Multi-agent pipeline for analyzing customer feedback",
    version="2.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper: run full pipeline for one feedback ─────────────────────────────────
async def _run_pipeline(feedback: str, source: str, trace_id: str) -> tuple[FeedbackResponse, bool]:
    """Returns (response, was_cached)."""

    # Enhancement #8 — check cache first
    cached_result = feedback_cache.get(feedback)
    if cached_result:
        logger.info(f"[{trace_id}] Cache HIT")
        cached_result.trace_id = trace_id  # fresh trace_id even for cached
        cached_result.cached = True
        return cached_result, True

    logger.info(f"[{trace_id}] Cache MISS — calling agents")
    sentiment = await analyze_sentiment(feedback, trace_id=trace_id)
    topics    = await cluster_topics(feedback, trace_id=trace_id)
    urgency   = await classify_urgency(feedback, sentiment, trace_id=trace_id)
    insights  = await generate_insights(feedback, sentiment, topics, urgency, trace_id=trace_id)

    response = FeedbackResponse(
        trace_id=trace_id,
        feedback=feedback,
        sentiment=sentiment,
        topics=topics,
        urgency=urgency,
        insights=insights,
        cached=False,
    )

    feedback_cache.set(feedback, response)
    return response, False


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Customer Feedback AI is running 🚀", "version": "2.1.0"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": "2.1.0",
        "model": "gpt-4o-mini",
        "uptime_seconds": int(time.time() - _start_time),
        "cache": feedback_cache.stats,
    }


@app.get("/cache/stats")
def cache_stats():
    """Enhancement #8 — view cache performance."""
    return feedback_cache.stats


@app.post("/analyze", response_model=FeedbackResponse)
@limiter.limit("10/minute")
async def analyze_feedback(request: Request, body: FeedbackRequest):
    trace_id = str(uuid.uuid4())[:8]
    logger.info(f"[{trace_id}] /analyze | source={body.source} | customer={body.customer_id}")
    try:
        response, _ = await _run_pipeline(body.feedback, body.source or "unknown", trace_id)
        logger.info(f"[{trace_id}] Done | sentiment={response.sentiment.label} | urgency={response.urgency.level}")
        return response
    except Exception as e:
        logger.error(f"[{trace_id}] Pipeline error: {e}")
        return JSONResponse(
            status_code=500,
            content={"trace_id": trace_id, "detail": "Pipeline error. Check server logs."}
        )


@app.post("/analyze/batch", response_model=BatchFeedbackResponse)
@limiter.limit("3/minute")   # stricter limit for batch
async def analyze_batch(request: Request, body: BatchFeedbackRequest):
    """
    Enhancement #5 — Batch analysis endpoint.
    Accepts up to 20 feedback strings, runs pipeline concurrently.
    Cached results are returned instantly without API calls.
    """
    batch_id = str(uuid.uuid4())[:8]
    logger.info(f"[batch:{batch_id}] Batch request | count={len(body.feedbacks)} | source={body.source}")

    async def process_one(index: int, feedback: str) -> BatchItemResult:
        trace_id = f"{batch_id}-{index}"
        try:
            response, was_cached = await _run_pipeline(feedback, body.source or "batch", trace_id)
            return BatchItemResult(
                index=index,
                feedback=feedback,
                result=response,
                cached=was_cached,
            )
        except Exception as e:
            logger.error(f"[{trace_id}] Failed: {e}")
            return BatchItemResult(
                index=index,
                feedback=feedback,
                error=str(e),
            )

    # Run all concurrently
    tasks   = [process_one(i, fb) for i, fb in enumerate(body.feedbacks)]
    results = await asyncio.gather(*tasks)

    successful = sum(1 for r in results if r.result is not None)
    failed     = sum(1 for r in results if r.error is not None)

    logger.info(f"[batch:{batch_id}] Complete | success={successful} | failed={failed}")

    return BatchFeedbackResponse(
        batch_id=batch_id,
        total=len(results),
        successful=successful,
        failed=failed,
        results=list(results),
    )
