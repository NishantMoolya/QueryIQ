from pathlib import Path
from fastapi import UploadFile, Query
from fastapi.responses import JSONResponse
from core.config import settings
from datetime import datetime
from db.connect import connectDB
from bson import ObjectId
from models.user_auth import UserFile
from services.text_extractor import text_extractor
from langchain_core.documents import Document
from typing import List
import os

UPLOAD_DIR = Path(__file__).parent.parent / settings.UPLOAD_FILE_PATH
UPLOAD_DIR.mkdir(exist_ok=True)

db = connectDB()
user_files = db["files"]
user_text_chunks = db["text_chunks"]

async def upload_file(file: UploadFile, user_id: str):
    # Add current datetime to filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename_parts = file.filename.rsplit('.', 1)
    if len(filename_parts) == 2:
        filename = f"{filename_parts[0]}_{timestamp}.{filename_parts[1]}"
    else:
        filename = f"{file.filename}_{timestamp}"
    file_location = UPLOAD_DIR / filename
    try:
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        
        # Insert file record in the database
        file_doc = {
            "user_id": ObjectId(user_id),
            "filename": filename,
            "is_file_uploaded": True,
            "is_text_extracted": False,
            "file_path": str(file_location),
            "uploaded_at": datetime.now(),
            "file_summary": "",
            "num_of_chunks": 0
        }
        result = user_files.insert_one(file_doc)
        
        return JSONResponse(status_code=201,content={"filename": filename, "message": "File uploaded successfully", "file_id": str(result.inserted_id)})
    except Exception as e:
        print(f"File upload failed: {str(e)}")
        return JSONResponse(status_code=500,content={"filename": filename, "message": "File upload failed"})

async def extract_text_from_userfile(file: UserFile, user_id: str):
    try:
        # Retrieve the user's file document from the database
        user_file = user_files.find_one({"user_id": ObjectId(user_id), "_id": ObjectId(file.file_id)})
        if not user_file:
            return JSONResponse(status_code=404, content={"message": "User file not found."})
        
        if user_file['is_text_extracted'] == True:
            return JSONResponse(status_code=201,content={"message": "File processed and text chunks already inserted successfully."})
        
        # Extract text chunks from the file
        text_chunks: List[Document] = await text_extractor(filepath=user_file["file_path"])
        
        final_text_chunks = []
        for i, chunk in enumerate(text_chunks):
            doc = {
                "index": i,
                "file_id": file.file_id,
                "text": chunk.page_content,
                "metadata": chunk.metadata,
                "is_image_created": False,
                "image": ""
            }
            final_text_chunks.append(doc)
            
        result = user_text_chunks.insert_many(final_text_chunks)
        # Delete the uploaded file from the filesystem
        file_path = user_file["file_path"]
        if result and os.path.exists(file_path):
            os.remove(file_path)
            
        user_files.update_one({ "_id": ObjectId(file.file_id), "user_id": ObjectId(user_id)},{"$set": { "is_text_extracted": True, "num_of_chunks": len(text_chunks) }})
        
        return JSONResponse(status_code=201,content={"message": "File processed and text chunks inserted successfully."})
    except Exception as e:
        print(f"File processing failed: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "File processing failed."})

async def get_text_chunks(file_id: str,page: int = Query(1, ge=1),limit: int = Query(2, ge=1)):
    try:
        skip = (page - 1) * limit
        query = {"file_id": file_id}

        total_chunks = user_text_chunks.count_documents(query)
        chunks_cursor = user_text_chunks.find(query).sort("index", 1).skip(skip).limit(limit)
        chunks = list(chunks_cursor)

        # Convert ObjectId to string for JSON serialization
        for chunk in chunks:
            chunk["_id"] = str(chunk["_id"])

        return JSONResponse(
            status_code=200,
            content={
                "page": page,
                "limit": limit,
                "total": total_chunks,
                "total_pages": (total_chunks + limit - 1) // limit,
                "chunks": chunks
            }
        )
    except Exception as e:
        print(f"Error retrieving paginated chunks: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "Failed to fetch text chunks."}) 
    
async def remove_user_file(user_id: str, file_id: str):
    try:
        # Retrieve the file document
        user_file = user_files.find_one({"_id": ObjectId(file_id), "user_id": ObjectId(user_id)})
        if not user_file:
            return JSONResponse(status_code=404, content={"message": "File not found."})

        # Delete the physical file if it exists
        file_path = user_file.get("file_path", "")
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete all text chunks associated with this file
        user_text_chunks.delete_many({"file_id": file_id})

        # Delete the file record from the DB
        user_files.delete_one({"_id": ObjectId(file_id), "user_id": ObjectId(user_id)})

        return JSONResponse(status_code=200, content={"message": "File and associated chunks deleted successfully."})
    
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "Failed to delete file."})   
