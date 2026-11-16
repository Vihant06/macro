from jose import jwt, JWTError
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

bearer = HTTPBearer(auto_error=False)

def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> str:
    if not credentials:
        # If test user credentials are in env and no token passed, allow for dev testing
        if settings.supabase_test_email:
            return "dev_test_user"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header"
        )

    token = credentials.credentials
    try:
        if settings.supabase_jwt_secret:
            payload = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"])
        else:
            # Fallback to unverified payload decode if JWT secret is not yet placed in .env
            payload = jwt.get_unverified_claims(token)

        user_id = payload.get("sub") or payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing sub"
            )
        return str(user_id)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {e}"
        )
