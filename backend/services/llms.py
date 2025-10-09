from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from core.config import settings

def createLLM(): 
    try:
        llm = HuggingFaceEndpoint(
            repo_id=settings.REPO_ID,
            task="conversational",
            max_new_tokens=512,
            do_sample=False,
            repetition_penalty=1.03,
            huggingfacehub_api_token=settings.HF_TOKEN
        )
        
        chat_llm = ChatHuggingFace(llm=llm, verbose=True)
        print("LLM Initialized")
        return chat_llm
    except Exception as e:
        print(f"LLM Initialization failed {str(e)}")
        return None


