from langchain.chat_models import init_chat_model

def createLLM(): 
    try:        
        chat_llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
        print("LLM Initialized")
        return chat_llm
    except Exception as e:
        print(f"LLM Initialization failed {str(e)}")
        return None
