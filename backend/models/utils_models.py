from pydantic import BaseModel

class DecodedToken(BaseModel):
    status: bool
    data: str
    message: str
