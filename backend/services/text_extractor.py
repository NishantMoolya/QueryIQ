from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter

async def get_docs(filepath: str) -> List[Document]:
    # Initialize the loader with your PDF file
    loader = PyPDFLoader(filepath)

    # Load the document asynchronously
    documents = await loader.aload()

    # Output the loaded documents for verification
    # print(documents)

    return documents

async def split_docs(docs: List[Document]) -> List[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=450,
        chunk_overlap=20,
        separators=["\n\n", "\n", "."],
    )
    
    chunks = text_splitter.split_documents(docs)
        
    return chunks

async def text_extractor(filepath: str) -> List[Document]:
    docs = await get_docs(filepath=filepath)
    doc_chunks = await split_docs(docs)
    return doc_chunks