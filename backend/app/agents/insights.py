import logging
from typing import List
from app.utils.llm import call_llm
from app.models.schemas import SentimentResult, TopicCluster, UrgencyResult

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an Insight Generator Agent.
Given customer feedback analysis results, produce a concise, actionable business insight in 2-3 sentences.
Focus on what the business should do next based on the findings."""


async def generate_insights(
    feedback: str,
    sentiment: SentimentResult,
    topics: List[TopicCluster],
    urgency: UrgencyResult,
    trace_id: str = ""
) -> str:
    try:
        topic_names = ", ".join([t.topic for t in topics])
        user_message = f"""Feedback: {feedback}
Sentiment: {sentiment.label} (confidence: {sentiment.score})
Topics: {topic_names}
Urgency: {urgency.level} — {urgency.reason}"""
        return await call_llm(SYSTEM_PROMPT, user_message, trace_id=trace_id)
    except Exception as e:
        logger.error(f"[{trace_id}] Insight generation failed: {e}")
        return "Unable to generate insights at this time. Please retry."
