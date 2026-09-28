import json
import boto3
from typing import Dict, Any, List, Optional
from backend.config.settings import settings

class BedrockClient:
    """
    Amazon Bedrock Runtime interface.
    Invokes Anthropic Claude 3.5 Sonnet / Llama on AWS Bedrock.
    Falls back gracefully to intelligent local generation if AWS credentials are not active.
    """
    def __init__(self):
        self.model_id = settings.BEDROCK_MODEL_ID
        self.client = None
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            try:
                self.client = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    aws_session_token=settings.AWS_SESSION_TOKEN or None
                )
            except Exception as e:
                self.client = None

    def invoke(self, system_prompt: str, user_prompt: str, max_tokens: int = 1000) -> Optional[str]:
        if not self.client:
            return None

        try:
            # Format payload for Claude 3.5 Sonnet on Bedrock
            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2
            }

            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )

            response_body = json.loads(response.get("body").read())
            content = response_body.get("content", [])
            if content and isinstance(content, list):
                return content[0].get("text", "")
            return None
        except Exception as e:
            # Fall back to structured agent reasoning
            return None

_bedrock_client = None
def get_bedrock_client() -> BedrockClient:
    global _bedrock_client
    if _bedrock_client is None:
        _bedrock_client = BedrockClient()
    return _bedrock_client
