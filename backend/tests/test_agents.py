import pytest
from app.agents.sentiment import analyze_sentiment
from app.agents.clustering import cluster_topics
from app.agents.urgency import classify_urgency
from app.agents.insights import generate_insights
from app.models.schemas import SentimentLabel, SentimentResult, UrgencyLevel

SAMPLE_FEEDBACK = "The app keeps crashing on checkout and support is not responding. Very frustrated!"

@pytest.mark.asyncio
async def test_sentiment_analysis():
    result = await analyze_sentiment(SAMPLE_FEEDBACK)
    assert result.label in [e.value for e in SentimentLabel]
    assert 0.0 <= result.score <= 1.0
    assert len(result.explanation) > 0

@pytest.mark.asyncio
async def test_topic_clustering():
    result = await cluster_topics(SAMPLE_FEEDBACK)
    assert isinstance(result, list)
    assert len(result) >= 1
    assert all(hasattr(t, "topic") and hasattr(t, "keywords") for t in result)

@pytest.mark.asyncio
async def test_urgency_classification():
    sentiment = SentimentResult(
        label=SentimentLabel.NEGATIVE,
        score=0.92,
        explanation="Very negative tone with frustration expressed"
    )
    result = await classify_urgency(SAMPLE_FEEDBACK, sentiment)
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
    topics = [
        TopicCluster(topic="App Stability", keywords=["crash", "checkout", "bug"]),
        TopicCluster(topic="Customer Support", keywords=["response", "support", "help"])
    ]
    urgency = UrgencyResult(level="high", reason="Checkout failures directly impact revenue")
    result = await generate_insights(SAMPLE_FEEDBACK, sentiment, topics, urgency)
    assert isinstance(result, str)
    assert len(result) > 10

@pytest.mark.asyncio
async def test_full_pipeline():
    sentiment = await analyze_sentiment(SAMPLE_FEEDBACK)
    topics = await cluster_topics(SAMPLE_FEEDBACK)
    urgency = await classify_urgency(SAMPLE_FEEDBACK, sentiment)
    insight = await generate_insights(SAMPLE_FEEDBACK, sentiment, topics, urgency)

    assert sentiment.label in [e.value for e in SentimentLabel]
    assert len(topics) >= 1
    assert urgency.level in [e.value for e in UrgencyLevel]
    assert isinstance(insight, str) and len(insight) > 10
