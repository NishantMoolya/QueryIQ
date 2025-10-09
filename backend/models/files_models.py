from pydantic import BaseModel

class FilePayload(BaseModel):
    file_url: str
    file_name: str
    file_type: str