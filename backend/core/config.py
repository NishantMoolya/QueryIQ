from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_URL: str
    UPLOAD_FILE_PATH: str
    JWT_SECRET_KEY: str
    JWT_EXPIRE_TIME: int
    JWT_TOKEN_NAME: str
    HF_TOKEN: str
    REPO_ID: str
    IMAGE_MODEL_ID: str
    NEBIUS_API_KEY: str

    class Config:
        env_file = ".env"
        

settings = Settings()
