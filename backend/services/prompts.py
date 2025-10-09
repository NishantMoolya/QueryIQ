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

router_messages = [
    (
        "system",
        "You are a routing assistant. Your task is to analyze the user's question and decide which source can best provide an accurate answer. "
        "Return one of these strings: 'rag', 'db', or 'csv'.\n"
        "- Return 'db' if the question is best answered by querying structured database tables.\n"
        "- Return 'csv' if the question matches or relates to tabular data that would come from CSV files.\n"
        "- Return 'rag' if neither database nor CSV data are appropriate, and retrieval-augmented generation (RAG) should be used.\n"
        "Focus only on the content and type of the user query, not on the availability of schemas or files."
    ),
    (
        "human",
        "User Query: {query}"
        "DB Schema: {db_schema}"
        "CSV Schema: {csv_schema}"
    )
]

router_prompt_template = ChatPromptTemplate.from_messages(messages=router_messages)