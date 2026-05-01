import json
from typing import List
from app.utils.llm import call_llm
from app.models.schemas import TopicCluster

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


async def cluster_topics(feedback: str) -> List[TopicCluster]:
    raw = await call_llm(SYSTEM_PROMPT, feedback)
    data = json.loads(raw)
    return [TopicCluster(**item) for item in data]
