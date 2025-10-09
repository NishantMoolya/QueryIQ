from langchain.prompts import ChatPromptTemplate

rag_chat_messages = [
    (
        "system",
        "You are an AI assistant. Use the following context to answer the user's question." 
        "Be as accurate and detailed as possible without adding information not supported by the context." 
        "If the answer is not contained in the context, say you don't know."
    ),
    (
        "human",
        '''
            Context:  
            {context}

            User Query:  
            {query}
        '''
    )
]

rag_chat_prompt_template = ChatPromptTemplate.from_messages(messages=rag_chat_messages)