from pymongo import MongoClient
from core.config import settings

def connectDB():
    """
    Connects to MongoDB running on localhost and returns the client db instance.
    """
    client = MongoClient(settings.DB_URL)
    return client["genpix"]

# Example usage:
# client = get_mongo_client()
# db = client["your_database_name"]