from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class UrgencyLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SentimentResult(BaseModel):
    label: SentimentLabel
    score: float  # 0.0 to 1.0 confidence
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
    source: Optional[str] = "unknown"  # e.g. "email", "chat", "form"


class FeedbackResponse(BaseModel):
    feedback: str
    sentiment: SentimentResult
    topics: List[TopicCluster]
    urgency: UrgencyResult
    insights: str
