# # Import your LLM creation function
# from llms import createLLM
# from build_schema import build_schema_prompt

# # Initialize LLM once (maybe in module global or before calling)
# llm = createLLM()

# def nl_to_sql_with_dynamic_schema(prompt: str, schemas: dict) -> str:
#     """
#     Generate SQL from natural language query using langchain Gemini model,
#     providing all table schemas dynamically in the prompt.
#     """
#     if llm is None:
#         raise RuntimeError("LLM initialization failed")

#     schema_prompt = build_schema_prompt(schemas)
#     full_prompt = f"""
# You are an expert SQL query generator. Here are the table schemas:
# {schema_prompt}

# User request: {prompt}

# Only output valid SQL queries using the relevant table(s).
# """

#     # Call LLM -> adjust this based on langchain's chat_llm interface
#     # Assuming it has a 'generate' or '__call__' interface that accepts a string prompt
#     response = llm(full_prompt)  # or llm.generate(full_prompt)

#     # If response is a Message or object, adjust accordingly to get the text content
#     sql_query = response if isinstance(response, str) else str(response)

#     response = llm(full_prompt)

# if hasattr(response, "content"):
#     sql_query = response.content
# else:
#     sql_query = str(response)

# if sql_query.startswith("```
#     sql_query = sql_query.split('\n', 1)  # get the content after opening ```
# if sql_query.endswith("```
#     sql_query = sql_query.rsplit('\n', 1)  # get content before closing ```

# return sql_query.strip()







# # from utils.build_schema import build_schema_prompt

# # def nl_to_sql_with_dynamic_schema(prompt: str, schemas: dict) -> str:
# #     """
# #     Generate SQL from natural language query using Gemini,
# #     providing all table schemas dynamically in the prompt.
# #     """
# #     schema_prompt = build_schema_prompt(schemas)
# #     full_prompt = f"""
# # You are an expert SQL query generator. Here are the table schemas:
# # {schema_prompt}

# # User request: {prompt}

# # Only output valid SQL queries using the relevant table(s).
# # """
# #     response = client.models.generate_content(
# #         model="gemini-2.5-flash",
# #         contents=[full_prompt],
# #         config=types.GenerateContentConfig(
# #             temperature=0,
# #             max_output_tokens=512
# #         )
# #     )

# #     if isinstance(response.text, list):
# #         sql_query = response.text[0].strip()
# #     else:
# #         sql_query = response.text.strip()

# #     # Remove Markdown code block markers if present
# #     if sql_query.startswith("```"):
# #         sql_query = sql_query.split('\n', 1)[1]
# #     if sql_query.endswith("```"):
# #         sql_query = sql_query.rsplit('\n', 1)[0]

# #     return sql_query.strip()


# Import your LLM creation function
from llms import createLLM
from build_schema import build_schema_prompt

# Initialize LLM once (maybe in module global or before calling)
llm = createLLM()

def nl_to_sql_with_dynamic_schema(prompt: str, schemas: dict) -> str:
    """
    Generate SQL from natural language query using langchain Gemini model,
    providing all table schemas dynamically in the prompt.
    """
    if llm is None:
        raise RuntimeError("LLM initialization failed")

    schema_prompt = build_schema_prompt(schemas)
    full_prompt = f"""
You are an expert SQL query generator. Here are the table schemas:
{schema_prompt}

User request: {prompt}

Only output valid SQL queries using the relevant table(s).
"""

    # Call LLM -> adjust this based on langchain's chat_llm interface
    # Assuming it has a '__call__' interface that accepts a string prompt
    response = llm(full_prompt)  # or llm.generate(full_prompt)

    # Extract text content from the AIMessage response object
    if hasattr(response, "content"):
        sql_query = response.content
    else:
        sql_query = str(response)

    # Remove markdown code block if any
    if sql_query.startswith("```"):
        sql_query = sql_query.split('\n', 1)  # get the content after opening ```
    if sql_query.endswith("```"):
        sql_query = sql_query.rsplit('\n', 1)  # get content before closing ```

    return sql_query.strip()
