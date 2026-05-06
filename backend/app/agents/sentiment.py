import json
import logging
from app.utils.llm import call_llm
from app.models.schemas import SentimentResult, SentimentLabel

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Sentiment Analysis Agent.
Analyze the sentiment of the given customer feedback.
Respond ONLY with a JSON object (no markdown, no extra text) in this format:
{
  "label": "positive" | "negative" | "neutral",
  "score": <float between 0.0 and 1.0 representing confidence>,
  "explanation": "<one sentence explanation>"
}"""

CONFIDENCE_THRESHOLD = 0.4


async def analyze_sentiment(feedback: str, trace_id: str = "") -> SentimentResult:
    try:
        raw = await call_llm(SYSTEM_PROMPT, feedback, trace_id=trace_id)
        data = json.loads(raw)
        score = float(data.get("score", 0))

        if score < CONFIDENCE_THRESHOLD:
            logger.warning(f"[{trace_id}] Low confidence sentiment ({score}), marking uncertain")
            return SentimentResult(
                label=SentimentLabel.UNCERTAIN,
                score=score,
                explanation=data.get("explanation", "Confidence too low to determine sentiment.")
            )

        return SentimentResult(
            label=SentimentLabel(data["label"]),
            score=score,
            explanation=data["explanation"]
        )

    except (json.JSONDecodeError, KeyError, ValueError) as e:
        logger.error(f"[{trace_id}] Sentiment parsing failed: {e}")
        return SentimentResult(
            label=SentimentLabel.UNCERTAIN,
            score=0.0,
            explanation="Unable to determine sentiment due to a parsing error."
        )
