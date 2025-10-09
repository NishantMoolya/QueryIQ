from pymongo import MongoClient
from core.config import settings

def connectDB():
    try:
        if not settings.DB_URL:
            raise ValueError("DATABASE_URL environment variable not set")

        client = MongoClient(settings.DB_URL)
        print("Connection to the database established successfully.")
        return client["query_qi"]
    except Exception as e:
        print(f"An error occurred: {e} ")
        return None

db = connectDB()