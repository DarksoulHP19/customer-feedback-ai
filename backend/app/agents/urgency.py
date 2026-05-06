import json
import logging
from app.utils.llm import call_llm
from app.models.schemas import UrgencyResult, UrgencyLevel, SentimentResult

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an Urgency Classifier Agent.
Given a customer feedback and its sentiment, determine the urgency level of the issue.
Urgency levels: low, medium, high, critical.
Respond ONLY with a JSON object (no markdown, no extra text) in this format:
{
  "level": "low" | "medium" | "high" | "critical",
  "reason": "<one sentence reason for this urgency level>"
}"""


async def classify_urgency(feedback: str, sentiment: SentimentResult, trace_id: str = "") -> UrgencyResult:
    try:
        user_message = f"Feedback: {feedback}\nSentiment: {sentiment.label} (confidence: {sentiment.score})"
        raw = await call_llm(SYSTEM_PROMPT, user_message, trace_id=trace_id)
        data = json.loads(raw)
        return UrgencyResult(
            level=UrgencyLevel(data["level"]),
            reason=data["reason"]
        )
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        logger.error(f"[{trace_id}] Urgency classification failed: {e}")
        return UrgencyResult(level=UrgencyLevel.MEDIUM, reason="Unable to determine urgency; defaulting to medium.")
