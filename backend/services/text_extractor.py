from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
import io
import tempfile
import os

async def get_docs(file_bytes: bytes) -> List[Document]:
    """
    Load PDF directly from uploaded file bytes (without permanently saving).
    """
    # Create a temporary file just for reading (deleted automatically later)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp.flush()
        temp_path = tmp.name

    try:
        # Initialize the loader with temporary file path
        loader = PyPDFLoader(temp_path)
        documents = await loader.aload()
    finally:
        # Clean up the temporary file
        os.remove(temp_path)

    return documents

async def split_docs(docs: List[Document]) -> List[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=450,
        chunk_overlap=20,
        separators=["\n\n", "\n", "."],
    )
    
    chunks = text_splitter.split_documents(docs)
        
    return chunks

async def text_extractor(file_bytes: bytes) -> List[Document]:
    docs = await get_docs(file_bytes)
    doc_chunks = await split_docs(docs)
    return doc_chunks