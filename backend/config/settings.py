import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    SECRET_KEY: str = "campusflow-secret-super-secure-key-2026-hackathon"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AWS Settings
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_SESSION_TOKEN: Optional[str] = None

    # Amazon Bedrock
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    BEDROCK_EMBEDDING_MODEL_ID: str = "amazon.titan-embed-text-v2:0"
    BEDROCK_KNOWLEDGE_BASE_ID: Optional[str] = None

    # DynamoDB
    DYNAMODB_TABLE_PREFIX: str = "campusflow_"
    USE_DYNAMODB: bool = False

    # S3
    S3_BUCKET_NAME: str = "campusflow-academic-documents"
    USE_S3: bool = False

    # Cognito
    COGNITO_USER_POOL_ID: Optional[str] = None
    COGNITO_CLIENT_ID: Optional[str] = None
    COGNITO_REGION: str = "us-east-1"
    USE_COGNITO: bool = False

    # MCP
    MCP_SERVER_HOST: str = "127.0.0.1"
    MCP_SERVER_PORT: int = 8001
    MCP_SERVER_URL: str = "http://127.0.0.1:8001"
    MCP_API_KEY: str = "mcp_campusflow_secret_token_hackathon_2026"

    # Database
    DATABASE_URL: str = "sqlite:///./campusflow.db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
