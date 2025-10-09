from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import user_router
from routes.files_routes import files_router
from middlewares.auth_middleware import AuthMiddleware
from utils.custom_openapi import add_jwt_auth_to_openapi

app = FastAPI()

add_jwt_auth_to_openapi(app)

@app.get('/')
async def handleHome():
    return "Hello Client, I am healthy"

origins = [
    # "http://localhost:5173",
    # "https://genpix.netlify.app",  # Your Netlify frontend
    "*"
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware for user auth
app.add_middleware(AuthMiddleware)

# Include the routers
app.include_router(user_router, prefix="/api/v1/user", tags=["User Authentication"])
app.include_router(files_router, prefix="/api/v1/file", tags=["File Uploads"])

