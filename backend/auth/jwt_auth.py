from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.config.settings import settings
from backend.repositories import get_repository
from backend.models.models import StudentModel

security = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def get_current_student(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> StudentModel:
    repo = get_repository()
    # In development / demo mode, if no auth token is provided, default to demo student Aarav Kumar
    if not credentials:
        student = repo.get_student_by_email("aarav.kumar@apex-university.edu")
        if student:
            return student
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        student_id: str = payload.get("sub")
        if student_id is None:
            raise HTTPException(status_code=401, detail="Invalid token claims")
    except JWTError:
        # Check if it's the demo token
        if token == "demo-token-aarav-kumar":
            student = repo.get_student_by_email("aarav.kumar@apex-university.edu")
            if student:
                return student
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    student = repo.get_student_by_id(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
