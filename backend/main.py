import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config.settings import settings
from backend.api.routes import router as api_router

app = FastAPI(
    title="CampusFlow AI API",
    description="Backend API and Agent Orchestration Service for CampusFlow AI — Amazon Developer Hackathon (Alexa+ Track)",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CampusFlow AI API",
        "environment": settings.APP_ENV,
        "model_id": settings.BEDROCK_MODEL_ID,
        "dynamodb_enabled": settings.USE_DYNAMODB,
        "s3_enabled": settings.USE_S3,
        "cognito_enabled": settings.USE_COGNITO
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
