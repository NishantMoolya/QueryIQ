from services.prompts import router_prompt_template
from services.llms import chat_llm
from services.output_parsers import RouterOutputParser

async def router_chat(query: str, db_schema: str, csv_schema: str):
    try: 
        if chat_llm is None:
            raise Exception("No chatbot found")
        
        print("chatbot active.")
        
        print("chatbot responding...")
        chain_output = chat_llm.with_structured_output(RouterOutputParser)
        chain = router_prompt_template | chain_output
        
        chat_response = await chain.ainvoke({ "query": query, "db_schema": db_schema, "csv_schema": csv_schema })
        print(f"chatbot response: {len(chat_response)}, {chat_response}")
        
        return chat_response
    except Exception as e:
        print(f"an error: {str(e)}")
        return ""
        