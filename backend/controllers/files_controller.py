from fastapi import UploadFile
from fastapi.responses import JSONResponse
from typing import List, Union
from db.connect import db
import datetime
import uuid
from bson import ObjectId
from services.text_extractor import text_extractor
from services.vector_store import store_in_vectorstore
from langchain_core.documents import Document
from models.files_models import FilePayload
from services.fetch_tables_and_schemas_sqlalchemy import fetch_tables_and_schemas_sqlalchemy
from services.csv_schema_loader import get_csv_schema

user_files = db["user_files"]
knowledge_base_chunks = db["knowledge_base_chunks"]    

async def upload_files(user_id: str, files: List[UploadFile]):
    try:
        files_info = []
        documents = []

        for file in files:
            contents = await file.read()

            # Extract chunks using your text_extractor
            docs = await text_extractor(contents)
            
            uid = str(uuid.uuid4())
            # Prepare chunks for vectorstore
            final_docs = [
                Document(
                    page_content=doc.page_content,
                    metadata={
                        "uid": uid,     
                        "user_id": user_id,
                        "file_name": file.filename,
                        "file_type": file.content_type,
                        "uploaded_at": str(datetime.datetime.now())
                    }
                )
                for doc in docs
            ]
            documents.extend(final_docs)

            # Prepare metadata for file
            file_data = {
                "user_id": user_id,
                "file_name": file.filename,
                "file_type": file.content_type,
                "file_url": None,
                "uploaded_at": str(datetime.datetime.now()),
                "schema": "",
                "uid": uid    
            }

            # Insert and capture the inserted ID
            result = user_files.insert_one(file_data)
            file_data["_id"] = str(result.inserted_id)  # ✅ Convert ObjectId to string for JSON

            files_info.append(file_data)

        # Store embeddings in vector store
        is_stored = await store_in_vectorstore(documents)
        if not is_stored:
            raise Exception("Document chunks were not stored in vectorstore")

        print('Documents stored in vectorstore')

        return JSONResponse(
            status_code=201,
            content={
                "message": "Files uploaded and stored successfully",
                "data": files_info
            }
        )

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )
        
async def add_files(user_id: str, files: List[FilePayload]):
    try:
        files_info = []
        
        for file in files:
            schema = ""
            if file.file_type == 'db':
                schema = str(fetch_tables_and_schemas_sqlalchemy(file.file_url))
            elif file.file_type == 'csv':
                schema_dict = {}
                schema_dict[file.file_name] = file.file_url
                schema = await get_csv_schema(schema_dict)
            
            file_data = {
                "user_id": user_id,
                "file_name": file.file_name,
                "file_type": file.file_type,
                "file_url": file.file_url,
                "uploaded_at": str(datetime.datetime.now()),
                "schema": schema
            }

            print(f"schemas: {schema}")
            
            # Insert and capture the inserted ID
            result = user_files.insert_one(file_data)
            file_data["_id"] = str(result.inserted_id)
            files_info.append(file_data)
            
         
        return JSONResponse(
            status_code=201,
            content={
                "message": "Files uploaded and stored successfully",
                "data": files_info
            }
        )
            
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )
        
async def get_files(user_id: str, file_types: Union[List[str], None] = None):
    try:
        # Fetch all files for this user
        query = {"user_id": user_id}
        if file_types:
            query["file_type"] = {"$in": file_types}
            
        res = list(user_files.find(query))

        # Convert ObjectId to string for JSON serialization
        for file in res:
            file["_id"] = str(file["_id"])

        return JSONResponse(
            status_code=200,
            content={
                "message": "Files fetched successfully",
                "data": res
            }
        )

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )
        
async def remove_files(user_id: str, file_ids: Union[List[str], None] = None):
    try:
        if not file_ids:
            return JSONResponse(
            status_code=200,
            content={
                "message": "No files selected",
                "data": None
            }
        )
            
        uids_to_delete = []
        deleted_files = []

        for file_id in file_ids:
            # Find the file record
            existing_file = user_files.find_one({
                "_id": ObjectId(file_id),
                "user_id": user_id
            })

            if not existing_file:
                print(f"File not found for ID: {file_id}")
                continue

            uid = existing_file.get("uid", None)

            # Delete from user_files
            user_files.delete_one({"_id": ObjectId(file_id)})

            # If it's a PDF, mark its chunks for deletion
            if uid:
                uids_to_delete.append(uid)

            deleted_files.append({
                "file_id": file_id,
                "file_name": existing_file.get("file_name"),
                "file_type": existing_file.get("file_type")
            })

        # Delete PDF chunks only
        chunks_deleted = 0
        if uids_to_delete:
            result = knowledge_base_chunks.delete_many({"uid": {"$in": uids_to_delete}})
            chunks_deleted = result.deleted_count

        return JSONResponse(
            status_code=200,
            content={
                "message": "Files deleted successfully",
                "data": {
                    "total_files_deleted": len(deleted_files),
                    "pdf_chunks_deleted": chunks_deleted,
                    "deleted_files": deleted_files
                }
            }
        )

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )