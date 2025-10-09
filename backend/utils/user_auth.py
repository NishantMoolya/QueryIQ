import bcrypt
import jwt
from datetime import datetime, timedelta
from core.config import settings
from models.utils_models import DecodedToken

def get_password_hash(password: str) -> str:
    # bcrypt expects bytes, so encode the password string
    password_bytes = password.encode('utf-8')
    # Generate a salt and hash the password
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    # Return the hashed password as a decoded string
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(user_id: str, expires_delta: timedelta | None = None):
    to_encode = {"_id": user_id}
    expire = datetime.now() + (expires_delta or timedelta(minutes=settings.JWT_EXPIRE_TIME))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def decode_access_token(token: str) -> DecodedToken:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("_id")
        if not user_id:
            return DecodedToken(status=False, data="", message="user id not found")
        return DecodedToken(status=True, data=user_id, message="Token valid")
    except jwt.ExpiredSignatureError:
        return DecodedToken(status=False, data="", message="Token expired")
    except jwt.PyJWTError:
        return DecodedToken(status=False, data="", message="Invalid token")
