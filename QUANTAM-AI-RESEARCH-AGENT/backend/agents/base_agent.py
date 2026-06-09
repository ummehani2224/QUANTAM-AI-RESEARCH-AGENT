import os
import logging
from typing import Dict, Any, Optional
import httpx

# Configure logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("BaseAgent")

class BaseAgent:
    """
    Base agent class providing shared functionality for all research agents,
    including LLM orchestration, structured output parsing, error handling, and telemetry.
    """
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.llm_model = os.getenv("AGENT_LLM_MODEL", "openai/gpt-3.5-turbo")
        self.timeout = float(os.getenv("AGENT_TIMEOUT_SECONDS", "30.0"))

    async def call_llm(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Helper method to communicate with OpenRouter or equivalent model gateway.
        """
        if not self.api_key:
            logger.warning(f"[{self.name}] No OPENROUTER_API_KEY found. Operating in Mock/Local mode.")
            return self.get_mock_response(prompt)

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://github.com/AbhiTrivedi2712/QUANTAM-AI-RESEARCH-AGENT",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.llm_model,
            "messages": messages,
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"[{self.name}] Error communicating with LLM API: {e}")
            raise RuntimeError(f"Agent {self.name} failed to query LLM: {str(e)}")

    def get_mock_response(self, prompt: str) -> str:
        """
        Fallback mock response if no API key is provided.
        """
        return f"Mock response for agent [{self.name}] analyzing prompt: '{prompt[:60]}...'"

    async def analyze(self, symbol: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Abstract analyze method to be overridden by child agent classes.
        """
        raise NotImplementedError("Each research agent must implement its own analyze method.")
