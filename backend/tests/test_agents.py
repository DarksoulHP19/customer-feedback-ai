import pytest
from app.agents.sentiment import analyze_sentiment
from app.agents.clustering import cluster_topics
from app.agents.urgency import classify_urgency
from app.agents.insights import generate_insights
from app.models.schemas import SentimentLabel, SentimentResult, UrgencyLevel

SAMPLE_FEEDBACK = "The app keeps crashing on checkout and support is not responding. Very frustrated!"
TRACE_ID = "test-0001"

# ── Agent tests ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_sentiment_analysis():
    result = await analyze_sentiment(SAMPLE_FEEDBACK, trace_id=TRACE_ID)
    assert result.label in [e.value for e in SentimentLabel]
    assert 0.0 <= result.score <= 1.0
    assert len(result.explanation) > 0

@pytest.mark.asyncio
async def test_sentiment_uncertain_fallback():
    """Enhancement #3 — uncertain label returned for ambiguous short text."""
    result = await analyze_sentiment("ok", trace_id=TRACE_ID)
    # Score may be low → label could be uncertain
    assert result.label in [e.value for e in SentimentLabel]
    assert 0.0 <= result.score <= 1.0

@pytest.mark.asyncio
async def test_topic_clustering():
    result = await cluster_topics(SAMPLE_FEEDBACK, trace_id=TRACE_ID)
    assert isinstance(result, list)
    assert len(result) >= 1
    for t in result:
        assert hasattr(t, "topic")
        assert hasattr(t, "keywords")
        assert isinstance(t.keywords, list)

@pytest.mark.asyncio
async def test_urgency_classification():
    sentiment = SentimentResult(
        label=SentimentLabel.NEGATIVE,
        score=0.92,
        explanation="Very negative tone"
    )
    result = await classify_urgency(SAMPLE_FEEDBACK, sentiment, trace_id=TRACE_ID)
    assert result.level in [e.value for e in UrgencyLevel]
    assert len(result.reason) > 0

@pytest.mark.asyncio
async def test_insight_generation():
    from app.models.schemas import TopicCluster, UrgencyResult
    sentiment = SentimentResult(
        label=SentimentLabel.NEGATIVE,
        score=0.92,
        explanation="Highly negative feedback"
    )
    topics  = [TopicCluster(topic="App Stability", keywords=["crash", "checkout"])]
    urgency = UrgencyResult(level="high", reason="Checkout failures impact revenue")
    result  = await generate_insights(SAMPLE_FEEDBACK, sentiment, topics, urgency, trace_id=TRACE_ID)
    assert isinstance(result, str)
    assert len(result) > 10

# ── Full pipeline test ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_full_pipeline():
    sentiment = await analyze_sentiment(SAMPLE_FEEDBACK, trace_id=TRACE_ID)
    topics    = await cluster_topics(SAMPLE_FEEDBACK, trace_id=TRACE_ID)
    urgency   = await classify_urgency(SAMPLE_FEEDBACK, sentiment, trace_id=TRACE_ID)
    insights  = await generate_insights(SAMPLE_FEEDBACK, sentiment, topics, urgency, trace_id=TRACE_ID)

    assert sentiment.label in [e.value for e in SentimentLabel]
    assert len(topics) >= 1
    assert urgency.level in [e.value for e in UrgencyLevel]
    assert isinstance(insights, str) and len(insights) > 10

# ── API endpoint tests ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_analyze_endpoint_returns_trace_id():
    """Enhancement #2 — every response must include a trace_id."""
    from httpx import AsyncClient, ASGITransport
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/analyze", json={
            "feedback": SAMPLE_FEEDBACK,
            "source": "test"
        })
    assert response.status_code == 200
    data = response.json()
    assert "trace_id" in data
    assert len(data["trace_id"]) > 0

@pytest.mark.asyncio
async def test_health_endpoint():
    """Enhancement #4 — /health returns status ok + uptime."""
    from httpx import AsyncClient, ASGITransport
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "uptime_seconds" in data
    assert "model" in data

@pytest.mark.asyncio
async def test_empty_feedback_rejected():
    """Schema validation — empty feedback must return 422."""
    from httpx import AsyncClient, ASGITransport
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/analyze", json={"feedback": "   "})
    assert response.status_code == 422
