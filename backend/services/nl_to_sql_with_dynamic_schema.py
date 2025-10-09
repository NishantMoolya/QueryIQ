from services.llms import chat_llm
from services.build_schema import build_schema_prompt

# llm = createLLM()

def nl_to_sql_with_dynamic_schema(prompt: str, schemas: str) -> str:
    """
    Generate SQL from natural language query using langchain Gemini model,
    providing all table schemas dynamically in the prompt.
    """
    if chat_llm is None:
        raise RuntimeError("LLM initialization failed")

    full_prompt = f"""
        You are an expert SQL query generator. Here are the table schemas:
        {schemas}

        User request: {prompt}

        Only output valid SQL queries using the relevant table(s).
    """

    # Call LLM -> adjust this based on langchain's chat_llm interface
    # Assuming it has a '__call__' interface that accepts a string prompt
    response = chat_llm.invoke(full_prompt)  # or llm.generate(full_prompt)

    # Extract text content from the AIMessage response object
    if hasattr(response, "content"):
        sql_query = response.content
    else:
        sql_query = str(response)

    # Remove markdown code block if any
    if sql_query.startswith(""):
        sql_query = sql_query.lstrip("`").split('\n', 1)[-1]
    if sql_query.endswith(""):
        sql_query = sql_query.rsplit('\n', 1)

    return sql_query
