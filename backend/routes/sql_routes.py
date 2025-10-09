from fastapi import APIRouter
from services.db_chatbot import db_chat
from services.csv_schema_loader import csv_schema

sql_router = APIRouter()

@sql_router.post("/db")
async def handle_request():
    return await db_chat()

@sql_router.post("/csv")
async def handle_request():
    return await csv_schema()
