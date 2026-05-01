import json
from app.utils.llm import call_llm
from app.models.schemas import UrgencyResult, UrgencyLevel, SentimentResult

SYSTEM_PROMPT = """You are an Urgency Classifier Agent.
Given a customer feedback and its sentiment, determine the urgency level of the issue.
Urgency levels: low, medium, high, critical.
Respond ONLY with a JSON object (no markdown, no extra text) in this format:
{
  "level": "low" | "medium" | "high" | "critical",
  "reason": "<one sentence reason for this urgency level>"
}"""


async def classify_urgency(feedback: str, sentiment: SentimentResult) -> UrgencyResult:
    user_message = f"Feedback: {feedback}\nSentiment: {sentiment.label} (confidence: {sentiment.score})"
    raw = await call_llm(SYSTEM_PROMPT, user_message)
    data = json.loads(raw)
    return UrgencyResult(
        level=UrgencyLevel(data["level"]),
        reason=data["reason"]
    )
