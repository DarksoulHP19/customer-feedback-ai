import os
import logging
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ── Startup validation (Enhancement #4) ───────────────────────────────────────
_api_key = os.getenv("OPENAI_API_KEY")
if not _api_key:
    raise EnvironmentError(
        "OPENAI_API_KEY is missing. "
        "Add it to your .env file before starting the server."
    )

client = AsyncOpenAI(api_key=_api_key)


async def call_llm(
    system_prompt: str,
    user_message: str,
    model: str = "gpt-4o-mini",
    trace_id: str = ""
) -> str:
    """
    Generic async LLM wrapper using OpenAI.
    Logs each call with trace_id for observability.
    """
    logger.info(f"[{trace_id}] LLM call → model={model}")
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.3,
        )
        result = response.choices[0].message.content.strip()
        logger.info(f"[{trace_id}] LLM response received ({len(result)} chars)")
        return result
    except Exception as e:
        logger.error(f"[{trace_id}] LLM call failed: {e}")
        raise
