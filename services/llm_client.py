import os
from typing import Optional


class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")

    def is_available(self) -> bool:
        return bool(self.api_key)

    def generate_text(self, prompt: str) -> str:
        """
        Day 4 placeholder.
        Replace this with real API integration later.
        """
        return "LLM response placeholder. Replace with actual API call when key is configured."