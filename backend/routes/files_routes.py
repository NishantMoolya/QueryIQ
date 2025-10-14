from fastapi import APIRouter, UploadFile, File, Request, Query
from typing import List
from controllers.files_controller import upload_files, add_files, get_files
from models.files_models import FilePayload

files_router = APIRouter()

@files_router.post("/upload")
async def handle_request(request: Request, files: List[UploadFile] = File(...)):
    user_id = request.state.user_id
    return await upload_files(user_id, files)

@files_router.post("/add")
async def handle_request(request: Request, files: List[FilePayload]):
    user_id = request.state.user_id
    return await add_files(user_id, files)

@files_router.get("/")
async def handle_request(request: Request, file_type: List[str] = Query(default=None)):
    user_id = request.state.user_id
    return await get_files(user_id, file_type)
