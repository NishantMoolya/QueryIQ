from pydantic import BaseModel
from typing import List

class UserQuery(BaseModel):
    query: str
    sources: List[str]