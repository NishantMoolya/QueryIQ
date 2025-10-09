from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi.responses import JSONResponse
from utils.user_auth import decode_access_token
from core.security import security
from models.utils_models import DecodedToken

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        
         # 👇 Let CORS preflight requests pass through
        if request.method == "OPTIONS":
            return await call_next(request)
        
        path = request.url.path

        # Skip JWT check for public paths
        if not any(path.startswith(private) for private in security.PRIVATE_PATHS):
        # if path not in security.PRIVATE_PATHS:
            return await call_next(request)

        # Check Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            print("what man")
            return JSONResponse(status_code=401, content={"message": "Missing or invalid Authorization"})

        token = auth_header.split(" ")[1]
        try:
            token_info: DecodedToken = decode_access_token(token)
            if token_info.status == True:
                request.state.user_id = token_info.data  # Attach user_id to request for downstream access
            else:
                raise Exception()
        except Exception as e:
            print(f"an error occurred in authentication : {str(e)}")
            return JSONResponse(status_code=401, content={"status": False,"message": str(e)})

        return await call_next(request)
