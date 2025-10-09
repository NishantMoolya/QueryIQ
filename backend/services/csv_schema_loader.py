import pprint
import pandas as pd
import requests
from io import StringIO, BytesIO
from services.csv_query_handler import run_query 

# === CSV/Excel Loader from Supabase URLs ===
def load_file_from_url(url: str, name: str) -> pd.DataFrame | None:
    """Load CSV or Excel from a Supabase public/signed URL (handles ?token=)."""
    try:
        response = requests.get(url, allow_redirects=True)
        if response.status_code != 200:
            print(f"Failed to fetch {name} → HTTP {response.status_code}")
            print(f"URL used: {url}")
            return None

        content_type = response.headers.get("Content-Type", "")
        print(content_type)
        if "sheet" in content_type or url.lower().endswith((".xls", ".xlsx")):
            df = pd.read_excel(BytesIO(response.content))
        elif "csv" in content_type or url.lower().endswith(".csv"):
            df = pd.read_csv(StringIO(response.text), encoding="utf-8", on_bad_lines="skip")
        else:
            print(f"Unknown file type for {name}")
            return None

        if df.empty:
            print(f"No data in {name}")
            return None

        print(f"Loaded {name} ({df.shape[0]} rows × {df.shape[1]} cols)")
        return df

    except Exception as e:
        print(f"Error loading {name}: {e}")
        return None

def load_all_files_from_supabase(file_urls: dict[str, str]) -> dict[str, pd.DataFrame]:
    dataframes = {}

    if not file_urls:
        print("No URLs provided for loading.")
        return dataframes

    for name, url in file_urls.items():
        df = load_file_from_url(url, name)
        if df is not None:
            dataframes[name] = df

    if not dataframes:
        print("No valid files loaded from Supabase URLs.")
    else:
        print(f"Successfully loaded {len(dataframes)} files from Supabase.\n")

    return dataframes


# Schema Builder:  Generate schema description for each loaded DataFrame.
def build_schema_description(dataframes: dict[str, pd.DataFrame]) -> str:
    description = "Available files and their schemas:\n"
    for name, df in dataframes.items():
        cols = ", ".join(f"{col} ({dtype})" for col, dtype in zip(df.columns, df.dtypes))
        description += f"- {name} → {cols}\n"
    return description

# === Helper function to return schema as string ===
def get_csv_schema(file_urls: dict[str, str]) -> str:
    dataframes = load_all_files_from_supabase(file_urls)
    if not dataframes:
        return {
            "schema": "⚠️ No valid CSV/Excel files loaded. Schema cannot be generated.",
            "dataframes": {}
        }
    schema_str = build_schema_description(dataframes)
    return schema_str

async def csv_schema():
    file_urls = {
        "employee": "https://rsyfuinjwsxhbqvxofib.supabase.co/storage/v1/object/sign/csv_files/employees.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lODRlMTM4ZS0zNTM1LTQyZDYtYWI0ZS1hZDEwYTJiOWIxMWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjc3ZfZmlsZXMvZW1wbG95ZWVzLmNzdiIsImlhdCI6MTc2MDAzNDI4OCwiZXhwIjoxNzkxNTcwMjg4fQ.cl06zCGgB6bdw661g4VnV1ygGhN9RbRJeMeCbkxYzbE",
        "department": "https://rsyfuinjwsxhbqvxofib.supabase.co/storage/v1/object/sign/csv_files/department.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lODRlMTM4ZS0zNTM1LTQyZDYtYWI0ZS1hZDEwYTJiOWIxMWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjc3ZfZmlsZXMvZGVwYXJ0bWVudC5jc3YiLCJpYXQiOjE3NjAwMTc2ODgsImV4cCI6MTc5MTU1MzY4OH0.mSQ__bepm0HL4xzH6pr-1KFAnr0c3Zvwof1s814B8g4",
        "attendance": "https://rsyfuinjwsxhbqvxofib.supabase.co/storage/v1/object/sign/csv_files/attendance.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lODRlMTM4ZS0zNTM1LTQyZDYtYWI0ZS1hZDEwYTJiOWIxMWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjc3ZfZmlsZXMvYXR0ZW5kYW5jZS5jc3YiLCJpYXQiOjE3NjAwMTc2NTUsImV4cCI6MTc5MTU1MzY1NX0.uFPURYCV1XksspIH-HpnH50Y0Aqy1OlpDZk3IMaimdg",
        "salary": "https://rsyfuinjwsxhbqvxofib.supabase.co/storage/v1/object/sign/csv_files/salary.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lODRlMTM4ZS0zNTM1LTQyZDYtYWI0ZS1hZDEwYTJiOWIxMWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjc3ZfZmlsZXMvc2FsYXJ5LmNzdiIsImlhdCI6MTc2MDAzNTA1OSwiZXhwIjoxNzkxNTcxMDU5fQ.g0X9he4wN310npBtBTCZ_z4KK1Le9fxP9zi8FKWOkmk"
    }
    results = get_csv_schema(file_urls)
    prompt = "List the top 1 employees with highest salaries in each department."
    run_query_results = run_query(prompt, results["dataframes"], results["schema"])
    
    return run_query_results