# CampusFlow AI — Deployment Guide

## 1. Local Development Setup

### Prerequisites
- Python 3.10+ (with pip)
- Node.js 18+ & npm

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run All Services Concurrently
```bash
py scripts/run_all.py
```
This starts:
- **MCP Server**: `http://127.0.0.1:8001`
- **Backend API**: `http://127.0.0.1:8000`
- **Next.js Web App**: `http://localhost:3000`

---

## 2. AWS Production Deployment Architecture

```
Internet / Judges
      │
  [Amazon CloudFront]
      ├───────────────► [AWS Amplify / S3] (Next.js Static Frontend)
      └───────────────► [Application Load Balancer]
                              ├───────────────► [Amazon ECS / App Runner] (FastAPI Backend :8000)
                              └───────────────► [Amazon ECS / App Runner] (MCP Server :8001 /sse)
                                                      │
                                                      ├─────► Amazon Bedrock (Claude 3.5 Sonnet)
                                                      ├─────► Amazon DynamoDB (Tables: campusflow_*)
                                                      ├─────► Amazon S3 & Bedrock KB (Documents)
                                                      └─────► Amazon Cognito (Auth User Pool)
```

### AWS Service Configuration
1. **Amazon Bedrock**: Grant `bedrock:InvokeModel` IAM permissions for `anthropic.claude-3-5-sonnet-20241022-v2:0`.
2. **Amazon DynamoDB**: Set `USE_DYNAMODB=True` in `.env` to enable DynamoDB repository adapter.
3. **Amazon S3 & Bedrock KB**: Set `BEDROCK_KNOWLEDGE_BASE_ID` and `S3_BUCKET_NAME` for cloud vector search.
4. **Amazon Cognito**: Set `USE_COGNITO=True`, `COGNITO_USER_POOL_ID`, and `COGNITO_CLIENT_ID`.
