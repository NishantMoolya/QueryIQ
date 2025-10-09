from fastapi import APIRouter
from services.app import sql_tester
from services.csv_schema_loader import csv_schema

sql_router = APIRouter()

@sql_router.post("/sql_query")
async def handle_request():
    return await sql_tester()

@sql_router.post("/csv_query")
async def handle_request():
    return await csv_schema()
