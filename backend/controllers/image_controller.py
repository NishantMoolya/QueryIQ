from db.connect import connectDB
from fastapi.responses import JSONResponse
from typing import List
from bson import ObjectId
from models.files_models import ChunkNeighbours
from services.image_generator import image_generator

db = connectDB()
user_files = db["files"]
user_text_chunks = db["text_chunks"]

# helpers
async def get_file_summary(file_id: str) -> str:
    try:
        # Step 1: Ensure file exists
        file_doc = user_files.find_one({"_id": ObjectId(file_id)})
        if not file_doc:
            return ""

        return file_doc["file_summary"]

    except Exception as e:
        return ""

async def get_neighbour_text_chunks(file_id: str, index: int) -> ChunkNeighbours:

    # Step 1: Get max index for this file
    last_chunk = user_text_chunks.find(
        {"file_id": file_id}
    ).sort("index", -1).limit(1)
    
    last_chunk = list(last_chunk)

    max_index = last_chunk[0]["index"] if last_chunk else 0

    # Step 2: Prepare which neighbor indices to query
    neighbor_indices = []
    if index > 0:
        neighbor_indices.append(index - 1)
    if index < max_index:
        neighbor_indices.append(index + 1)

    # Step 3: Fetch neighbor chunks
    cursor = user_text_chunks.find({
        "file_id": file_id,
        "index": {"$in": neighbor_indices}
    }).skip(0).limit(len(neighbor_indices))

    neighbors =  list(cursor)

    # Step 4: Initialize results with empty strings
    previous_chunk = ""
    next_chunk = ""

    for chunk in neighbors:
        if chunk["index"] == index - 1:
            previous_chunk = chunk["text"]
        elif chunk["index"] == index + 1:
            next_chunk = chunk["text"]

    return ChunkNeighbours(previous_chunk=previous_chunk,next_chunk=next_chunk)

async def get_text_chunk_images(user_id: str,file_id: str, indexes: List[int]):
    try:
        query = {
            "file_id": file_id,
            "index": {"$in": indexes}
        }
        
        chunks_cursor = user_text_chunks.find(query).sort("index", 1)
        chunks = list(chunks_cursor)

        response_chunks = []

        for chunk in chunks:
            # Skip if image is already created
            if chunk.get("is_image_created"):
                response_chunks.append({
                    "index": chunk["index"],
                    "image": chunk.get("image", "")
                })
                continue

            # Generate image as a Base64-encoded string
            current_summary = await get_file_summary(file_id=file_id)
            chunk_neighbours = await get_neighbour_text_chunks(file_id=file_id,index=chunk['index'])
            result = await image_generator(current_summary,chunk["text"],chunk_neighbours.previous_chunk,chunk_neighbours.next_chunk)

            # Update the chunk with the generated image
            user_text_chunks.update_one(
                {"_id": chunk["_id"]},
                {"$set": {
                    "image": result.image,
                    "is_image_created": True
                }}
            )
            
            user_files.update_one({ "_id": ObjectId(file_id), "user_id": ObjectId(user_id)}, { "$set": { "file_summary": result.summary}})

            response_chunks.append({
                "index": chunk["index"],
                "image": result.image
            })

        return JSONResponse(
            status_code=200,
            content={
                "total": len(response_chunks),
                "image_chunks": response_chunks
            }
        )
    except Exception as e:
        print(f"Error retrieving chunks by indexes: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "Failed to fetch text chunks."})
