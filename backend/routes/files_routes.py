from fastapi import APIRouter
from fastapi import UploadFile, File, Request
from controllers.files_controller import upload_file, extract_text_from_userfile, get_text_chunks, remove_user_file
from controllers.image_controller import get_text_chunk_images
from models.user_auth import UserFile
from models.files_models import ChunkBody

files_router = APIRouter()
DEFAULT_PAGE = 1
DEFAULT_LIMIT = 2

@files_router.post("/upload")
async def handle_request(request: Request, file: UploadFile = File(...)):
    user_id = request.state.user_id
    return await upload_file(file,user_id)

@files_router.post("/extract")
async def handle_request(request: Request, file: UserFile):
    user_id = request.state.user_id
    return await extract_text_from_userfile(file,user_id)

@files_router.get("/text")
async def handle_request(file_id: str, page: int = DEFAULT_PAGE, limit: int = DEFAULT_LIMIT):
    return await get_text_chunks(file_id, page, limit)

@files_router.post("/text/image")
async def handle_request(request: Request, body: ChunkBody):
    user_id = request.state.user_id
    return await get_text_chunk_images(user_id, body.file_id ,body.indexes)

@files_router.delete("/{file_id}")
async def handle_request(request: Request, file_id: str):
    user_id = request.state.user_id
    return await remove_user_file(user_id, file_id)
