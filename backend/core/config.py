from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_URL: str
    JWT_SECRET_KEY: str
    JWT_EXPIRE_TIME: int
    JWT_TOKEN_NAME: str
    GOOGLE_API_KEY: str
    GROQ_API_KEY: str
    MODEL_NAME: str

    class Config:
        env_file = ".env"
        

settings = Settings()
