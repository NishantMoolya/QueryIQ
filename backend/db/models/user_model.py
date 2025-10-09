from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

class UserSchema(BaseModel):
    id: Optional[str] = Field(alias="_id")
    username: str
    email: EmailStr
    password: str
    created_at: Optional[str] = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True