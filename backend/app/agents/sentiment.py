import json
from app.utils.llm import call_llm
from app.models.schemas import SentimentResult, SentimentLabel

SYSTEM_PROMPT = """You are a Sentiment Analysis Agent.
Analyze the sentiment of the given customer feedback.
Respond ONLY with a JSON object (no markdown, no extra text) in this format:
{
  "label": "positive" | "negative" | "neutral",
  "score": <float between 0.0 and 1.0 representing confidence>,
  "explanation": "<one sentence explanation>"
}"""


async def analyze_sentiment(feedback: str) -> SentimentResult:
    raw = await call_llm(SYSTEM_PROMPT, feedback)
    data = json.loads(raw)
    return SentimentResult(
        label=SentimentLabel(data["label"]),
        score=data["score"],
        explanation=data["explanation"]
    )
