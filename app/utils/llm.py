import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def call_llm(system_prompt: str, user_message: str, model: str = "gpt-4o-mini") -> str:
    """Generic async LLM wrapper using OpenAI."""
    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()
