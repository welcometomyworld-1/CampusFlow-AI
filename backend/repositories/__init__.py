from backend.config.settings import settings
from backend.repositories.base_repository import BaseRepository
from backend.repositories.sqlite_repository import SQLiteRepository
from backend.repositories.dynamodb_repository import DynamoDBRepository

_repo_instance = None

def get_repository() -> BaseRepository:
    global _repo_instance
    if _repo_instance is None:
        if settings.USE_DYNAMODB:
            _repo_instance = DynamoDBRepository()
        else:
            _repo_instance = SQLiteRepository()
    return _repo_instance
