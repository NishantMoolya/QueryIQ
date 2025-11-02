import pandas as pd
from services.llms import chat_llm
from services.csv_schema_loader import load_all_files_from_supabase
from typing import Union

# === Prompt Builder ===
def create_multi_csv_prompt(user_query: str, schema_info: str) -> str:
    # schema_info = build_schema_description(dataframes)
    return f"""
You are an expert Python data analyst. You have access to multiple CSV files loaded as pandas DataFrames.

{schema_info}

Each DataFrame is named after its CSV file (e.g., `employee` for employee.csv).

User query:
\"\"\"{user_query}\"\"\"

Generate valid **pandas code** that:
- Uses the loaded DataFrames (joins, filters, aggregations, etc.)
- Produces a single DataFrame named `result`
- Does NOT import any libraries
- Does **NOT** use or reference any system-level, file, or network operations (e.g., `open`, `os`, `sys`, `eval`, `exec`, `__import__`, `subprocess`, `shutil`, `pathlib`, or similar)
- Does **NOT** access or modify the local file system, environment variables, or network
- Does **NOT** redefine built-in functions or manipulate globals
- Do not add any comments or explanations
- Handles missing or inconsistent columns gracefully (use conditional checks where needed)
- Avoids in-place modifications of existing DataFrames
- Keeps the output concise and interpretable

Output **only the Python code**, nothing else.
"""


# === Gemini Code Generator ===
def generate_code_with_gemini(prompt: str) -> str:
    try:
        response = chat_llm.invoke(prompt)
        code = response.content.strip("```python").strip("```").strip()
        print("Generated Code:\n", code, "\n")
        return code
    except Exception as e:
        print(f"Gemini API error: {e}")
        return ""

# === Security Checker ===
def is_secure(code: str) -> bool:
    """
    Check if the code contains any potentially dangerous commands.
    Returns True if code is safe, False otherwise.
    """
    # List of unsafe keywords/commands
    unsafe_keywords = [
        "import os", "import sys", "subprocess", "shutil", "pathlib", "eval", "exec",
        "__import__", "open(", "write(", "remove(", "delete(", "os.", "sys.", "input(",
        "socket"
    ]
    
    # Normalize the code for checking
    code_lower = code.lower()
    
    for keyword in unsafe_keywords:
        if keyword in code_lower:
            print(f"Unsafe keyword detected: {keyword}")
            return False
    return True

# === Safe Code Execution ===
def safe_execute(code: str, dataframes: dict[str, pd.DataFrame]) -> Union[pd.DataFrame, None]:
    if not code:
        print("No code to execute.")
        return None
    
    # Check if code is secure
    if not is_secure(code):
        print("Code failed security check. Execution aborted.")
        return None
    
    safe_globals = {
        "__builtins__": __builtins__,
        "pd": pd
    }

    code = "\n".join(line for line in code.split("\n") if "import" not in line)

    # local_vars = dataframes.copy()
    local_vars = {name.split('.')[0].lower(): df for name, df in dataframes.items()}
    try:
        exec(code, safe_globals, local_vars)
        result = local_vars.get("result")

        if result is None:
            print("No variable named 'result' found.")
            return None

        if isinstance(result, pd.DataFrame):
            print(f"Execution successful. Result: {result.shape[0]} rows × {result.shape[1]} cols.")
            result_json = result.to_dict(orient="records")
            return result_json
        
        else:
            print(f"Result is not a DataFrame (type: {type(result)}).")
            return result

    except Exception as e:
        print(f"Error executing generated code:\n{e}")
        return None

async def csv_chat(user_query: str, files: dict[str, str], schemas: str) -> dict:
    """
    Takes a user query, dictionary of DataFrames, and schema string.
    Generates pandas code using Gemini LLM, checks for security,
    executes the code safely, and returns a JSON-compatible result.
    """
    if not user_query.strip():
        return {"status": "error", "message": "No query provided.", "result": None}
    
    dataframes = load_all_files_from_supabase(files)
    #1.Build the prompt
    prompt = create_multi_csv_prompt(user_query, schemas)

    #2.Generate code via Gemini
    generated_code = generate_code_with_gemini(prompt)
    if not generated_code:
        return {"status": "error", "message": "Failed to generate code.", "result": None}

    #3.Execute code safely
    result_json = safe_execute(generated_code, dataframes)
    if result_json is None:
        return {"status": "error", "message": "Execution failed or result is empty.", "result": None}

    #4.Return output in structured JSON
    return {
        "status": "success",
        "message": "Query executed successfully.",
        "result": result_json
    }