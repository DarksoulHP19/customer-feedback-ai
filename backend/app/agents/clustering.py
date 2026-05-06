import json
import logging
from typing import List
from app.utils.llm import call_llm
from app.models.schemas import TopicCluster

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Topic Clustering Agent.
Identify the main topics discussed in the given customer feedback.
Respond ONLY with a JSON array (no markdown, no extra text) in this format:
[
  {
    "topic": "<topic name>",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]
Limit to a maximum of 3 topics."""


async def cluster_topics(feedback: str, trace_id: str = "") -> List[TopicCluster]:
    try:
        raw = await call_llm(SYSTEM_PROMPT, feedback, trace_id=trace_id)
        data = json.loads(raw)
        return [TopicCluster(**item) for item in data]
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        logger.error(f"[{trace_id}] Topic clustering failed: {e}")
        return [TopicCluster(topic="General", keywords=["feedback"])]
