from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field

str_output_parser = StrOutputParser()

class SummarizerOutput(BaseModel):
    summary: str = Field(default="", description="contains the summary of the provided text input")
    

class ImageDesignerOutput(BaseModel):
    img_prompt: str
    

