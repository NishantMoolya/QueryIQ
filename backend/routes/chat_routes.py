from fastapi import APIRouter, Request
from controllers.chat_controller import rag_based_chat
from models.chat_models import UserQuery

chat_router = APIRouter()

@chat_router.post("/answer")
async def handle_request(request: Request, body: UserQuery):
    user_id = request.state.user_id
    return await rag_based_chat(user_id, body.query)