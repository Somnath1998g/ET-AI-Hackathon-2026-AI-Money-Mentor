import os
from groq import Groq


class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def is_available(self) -> bool:
        return self.client is not None

    def generate_text(self, prompt: str) -> str:
        if not self.client:
            return "No Groq API key configured."

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful Indian personal finance mentor."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"LLM error: {str(e)}"