from fastapi.responses import JSONResponse
from services.rag_chatbot import rag_chat

async def rag_based_chat(user_id: str, user_query: str):
    try:
        res = await rag_chat(user_id, user_query)
        return JSONResponse(status_code=201,content={"message": "chat successful", "data": res})
    except Exception as e:
        # Handle unexpected errors
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(status_code=500,content={"message": f"An unexpected error occurred"})