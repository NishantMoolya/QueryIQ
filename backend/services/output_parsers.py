from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
from typing import Literal

str_output_parser = StrOutputParser()    

class RouterOutputParser(BaseModel):
    """Always use this tool to structure your response to the user."""
    source: Literal["rag", "db", "csv"] = Field(description="contains source of information")
    

