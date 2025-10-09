from services.llms import chat_llm
from services.output_parsers import str_output_parser
from services.prompts import general_prompt_template

async def general_chat(user_query: str):
    try: 
        if chat_llm is None:
            raise Exception("No chatbot found")
        
        print("chatbot active.")
        print("chatbot responding...")    
        chain = general_prompt_template | chat_llm | str_output_parser
        chat_response = await chain.ainvoke({ "query": user_query })
        print(f"chatbot response: {len(chat_response)}, {chat_response}")
        
        return chat_response
    except Exception as e:
        print(f"an error: {str(e)}")
        return ""
    
    
    
    