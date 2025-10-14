from services.llms import chat_llm
from services.prompts import rag_chat_prompt_template
from services.output_parsers import str_output_parser
from services.retriever import create_retriever
from utils.chatbot_utils import docs_to_str
from typing import Union

async def rag_chat(user_id: str, user_query: str, doc_ids: Union[list[str], None] = None):
    try: 
        if chat_llm is None:
            raise Exception("No chatbot found")
        
        print("chatbot active.")
        
        retriever = await create_retriever()
        if retriever == None:
            raise Exception("Retriever not found")
        
        print("retriever active.")
        print("retrieving context...")
        
        metadata_filter = {"user_id": user_id}
        if doc_ids:
            metadata_filter["uid"] = {"$in": doc_ids}
        docs = await retriever.ainvoke(user_query, metadata=metadata_filter)
        context = docs_to_str(docs)
        print("context: ", context)
        
        print("chatbot responding...")
        chain = rag_chat_prompt_template | chat_llm | str_output_parser
        
        chat_response = await chain.ainvoke({ "context": context, "query": user_query })
        print(f"chatbot response: {len(chat_response)}, {chat_response}")
        
        return chat_response
    except Exception as e:
        print(f"an error: {str(e)}")
        return ""
    
    
    
    