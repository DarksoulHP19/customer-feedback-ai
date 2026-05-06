"""
Enhancement #8 — In-memory LRU cache for agent responses.
Same feedback text → skip OpenAI call → return cached result.
Saves API cost for repeated/duplicate feedback entries.
"""
import hashlib
from collections import OrderedDict
from typing import Optional, Any

MAX_CACHE_SIZE = 200  # max unique feedback entries cached


class FeedbackCache:
    def __init__(self, max_size: int = MAX_CACHE_SIZE):
        self._cache: OrderedDict = OrderedDict()
        self._max_size = max_size
        self.hits = 0
        self.misses = 0

    def _key(self, text: str) -> str:
        """SHA-256 hash of normalized feedback text."""
        normalized = text.strip().lower()
        return hashlib.sha256(normalized.encode()).hexdigest()[:16]

    def get(self, text: str) -> Optional[Any]:
        key = self._key(text)
        if key in self._cache:
            self._cache.move_to_end(key)  # mark as recently used
            self.hits += 1
            return self._cache[key]
        self.misses += 1
        return None

    def set(self, text: str, value: Any) -> None:
        key = self._key(text)
        if key in self._cache:
            self._cache.move_to_end(key)
        else:
            if len(self._cache) >= self._max_size:
                self._cache.popitem(last=False)  # evict oldest
        self._cache[key] = value

    @property
    def stats(self) -> dict:
        total = self.hits + self.misses
        hit_rate = round(self.hits / total * 100, 1) if total > 0 else 0.0
        return {
            "size": len(self._cache),
            "max_size": self._max_size,
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate_pct": hit_rate,
        }


# Singleton instance used across the app
feedback_cache = FeedbackCache()
