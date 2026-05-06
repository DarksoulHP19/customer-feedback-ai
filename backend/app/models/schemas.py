from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum


class SentimentLabel(str, Enum):
    POSITIVE  = "positive"
    NEGATIVE  = "negative"
    NEUTRAL   = "neutral"
    UNCERTAIN = "uncertain"


class UrgencyLevel(str, Enum):
    LOW      = "low"
    MEDIUM   = "medium"
    HIGH     = "high"
    CRITICAL = "critical"


class SentimentResult(BaseModel):
    label: SentimentLabel
    score: float
    explanation: str


class TopicCluster(BaseModel):
    topic: str
    keywords: List[str]


class UrgencyResult(BaseModel):
    level: UrgencyLevel
    reason: str


class FeedbackRequest(BaseModel):
    feedback: str
    customer_id: Optional[str] = None
    source: Optional[str] = "unknown"

    @field_validator("feedback")
    @classmethod
    def feedback_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("feedback must not be empty")
        return v


class FeedbackResponse(BaseModel):
    trace_id: str
    feedback: str
    sentiment: SentimentResult
    topics: List[TopicCluster]
    urgency: UrgencyResult
    insights: str
    cached: bool = False   # Enhancement #8 — tells client if result was cached


# ── Batch models (Enhancement #5) ─────────────────────────────────────────────

class BatchFeedbackRequest(BaseModel):
    feedbacks: List[str]
    source: Optional[str] = "batch"

    @field_validator("feedbacks")
    @classmethod
    def validate_feedbacks(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("feedbacks list must not be empty")
        if len(v) > 20:
            raise ValueError("Maximum 20 feedbacks per batch request")
        cleaned = [f.strip() for f in v if f.strip()]
        if not cleaned:
            raise ValueError("All feedbacks are empty strings")
        return cleaned


class BatchItemResult(BaseModel):
    index: int
    feedback: str
    result: Optional[FeedbackResponse] = None
    error: Optional[str] = None
    cached: bool = False


class BatchFeedbackResponse(BaseModel):
    batch_id: str
    total: int
    successful: int
    failed: int
    results: List[BatchItemResult]
