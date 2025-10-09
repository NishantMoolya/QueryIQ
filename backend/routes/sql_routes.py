from fastapi import APIRouter
from services.app import sql_tester

sql_router = APIRouter()

@sql_router.post("/sql_query")
async def handle_request():
    return await sql_tester()
