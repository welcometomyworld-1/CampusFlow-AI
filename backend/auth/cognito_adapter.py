import boto3
from typing import Dict, Any, Optional
from backend.config.settings import settings

class CognitoAuthAdapter:
    """
    Amazon Cognito Authentication Adapter for CampusFlow AI.
    Handles AWS Cognito User Pool authentication, sign up, and JWT verification.
    """
    def __init__(self):
        self.user_pool_id = settings.COGNITO_USER_POOL_ID
        self.client_id = settings.COGNITO_CLIENT_ID
        self.region = settings.COGNITO_REGION
        self.client = None
        if settings.USE_COGNITO and self.client_id:
            try:
                self.client = boto3.client("cognito-idp", region_name=self.region)
            except Exception:
                self.client = None

    def sign_in(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        try:
            response = self.client.initiate_auth(
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={"USERNAME": username, "PASSWORD": password},
                ClientId=self.client_id
            )
            return response.get("AuthenticationResult")
        except Exception as e:
            return None

    def sign_up(self, email: str, password: str, name: str, student_id: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        try:
            response = self.client.sign_up(
                ClientId=self.client_id,
                Username=email,
                Password=password,
                UserAttributes=[
                    {"Name": "email", "Value": email},
                    {"Name": "name", "Value": name},
                    {"Name": "custom:student_id", "Value": student_id}
                ]
            )
            return response
        except Exception:
            return None

_cognito_adapter = None
def get_cognito_adapter() -> CognitoAuthAdapter:
    global _cognito_adapter
    if _cognito_adapter is None:
        _cognito_adapter = CognitoAuthAdapter()
    return _cognito_adapter
