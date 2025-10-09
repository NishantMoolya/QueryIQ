from pydantic import BaseModel
from typing import List

class ChunkBody(BaseModel):
    file_id: str
    indexes: List[int]
    
class ChunkNeighbours(BaseModel):
    previous_chunk: str = ""
    next_chunk: str = ""
    
class ImageGeneratorOuput(BaseModel):
    summary: str = ""
    image: str = ""