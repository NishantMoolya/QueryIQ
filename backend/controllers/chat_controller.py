from fastapi.responses import JSONResponse
from services.router_chatbot import router_chat
from services.rag_chatbot import rag_chat
from services.db_chatbot import db_chat
from services.csv_chatbot import csv_chat
from services.general_chatbot import general_chat
from db.connect import db

user_files = db["user_files"]

async def router_based_chat(user_id: str, user_query: str):
    try:
         # Fetch all files uploaded by the user
        user_files = list(db["user_files"].find({"user_id": user_id}))
        
        db_schema = ""
        csv_schema = ""
        csv_urls = {}
        db_url = ""
        doc_ids = []
        
        # Iterate and classify schemas
        for file in user_files:
            if file.get("file_type") == "db":
                db_schema += f"\n{file.get('schema', '')}"
                db_url = file.get('file_url', '')
            elif file.get("file_type") == "csv":
                csv_schema += f"\n{file.get('schema', '')}"
                csv_urls[file.get("file_name", 'default')] = file.get("file_url", '')
            elif file.get("file_type") == "application/pdf":
                doc_id = file.get("uid", None)
                if doc_id:
                    doc_ids.append(doc_id)
        
        print(f"DB Schema:\n{db_schema}")
        print(f"CSV Schema:\n{csv_schema}")
        print(f"doc Ids:\n{doc_ids}")
        
        src = await router_chat(user_query, db_schema, csv_schema)
        print(f"res: {src}")
        res = ""
        res_type = "str"
        
        if src == 'db':
            if len(db_url.strip()) == 0:
                raise Exception("db URL not found")
            res =  await db_chat(db_url, db_schema, user_query)
            res_type = 'json'
        elif src == 'csv':
            res = await csv_chat(user_query, csv_urls, csv_schema)
            res = res["result"]
            res_type = 'json'
        elif src == 'rag':
            res = await rag_chat(user_id, user_query, doc_ids)
        else:
            res = await general_chat(user_query)
        
        return JSONResponse(status_code=200,content={"message": "chat successful", "data": {"res": res, "type": res_type}})
    except Exception as e:
        # Handle unexpected errors
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(status_code=500,content={"message": f"An unexpected error occurred"})