import pprint
import pandas as pd
import requests
from io import StringIO, BytesIO

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
    """
    Load multiple CSV or Excel files from Supabase URLs.
    Example:
    {
        "employee": "https://xyz.supabase.co/storage/v1/object/public/data/employee.csv",
        "salaries": "https://xyz.supabase.co/storage/v1/object/public/data/salaries.xlsx"
    }
    """
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

    pprint(list(dataframes.keys()))
    return dataframes


# === Schema Builder ===
def build_schema_description(dataframes: dict[str, pd.DataFrame]) -> str:
    """Generate schema description for each loaded DataFrame."""
    description = "Available files and their schemas:\n"
    for name, df in dataframes.items():
        cols = ", ".join(f"{col} ({dtype})" for col, dtype in zip(df.columns, df.dtypes))
        description += f"- {name} → {cols}\n"
    return description