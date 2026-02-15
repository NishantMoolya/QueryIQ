from langchain.chat_models import init_chat_model
import os
from core.config import settings

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY

if not os.environ.get("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = settings.GROQ_API_KEY

def createLLM(): 
    try:        
        # chat_llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
        chat_llm = init_chat_model(settings.MODEL_NAME)
        print("LLM Initialized")
        return chat_llm
    except Exception as e:
        print(f"LLM Initialization failed {str(e)}")
        return None

chat_llm = createLLM()