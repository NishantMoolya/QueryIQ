import pandas as pd
import aiohttp
from io import StringIO, BytesIO

# === CSV/Excel Loader from URLs ===
async def load_file_from_url(url: str, name: str) -> pd.DataFrame | None:
    """Load CSV or Excel from a Supabase public/signed URL (async with aiohttp)."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, allow_redirects=True) as response:
                if response.status != 200:
                    print(f"Failed to fetch {name} → HTTP {response.status}")
                    print(f"URL used: {url}")
                    return None

                content_type = response.headers.get("Content-Type", "")
                content = await response.read()  # get raw bytes
                print(f"{name}: content type → {content_type}")

                # Detect and load file based on type
                if "sheet" in content_type or url.lower().endswith((".xls", ".xlsx")):
                    df = pd.read_excel(BytesIO(content))
                elif "csv" in content_type or url.lower().endswith(".csv"):
                    text = content.decode("utf-8", errors="ignore")
                    df = pd.read_csv(StringIO(text), encoding="utf-8", on_bad_lines="skip")
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


async def load_all_files_from_supabase(file_urls: dict[str, str]) -> dict[str, pd.DataFrame]:
    """Load multiple CSV/Excel files concurrently from Supabase URLs."""
    if not file_urls:
        print("No URLs provided for loading.")
        return {}

    import asyncio
    tasks = [load_file_from_url(url, name) for name, url in file_urls.items()]
    results = await asyncio.gather(*tasks)

    dataframes = {name: df for (name, _), df in zip(file_urls.items(), results) if df is not None}

    if not dataframes:
        print("No valid files loaded from Supabase URLs.")
    else:
        print(f"\nSuccessfully loaded {len(dataframes)} files from Supabase.\n")

    return dataframes

# Schema Builder:  Generate schema description for each loaded DataFrame.
def build_schema_description(dataframes: dict[str, pd.DataFrame]) -> str:
    description = "Available files and their schemas:\n"
    for name, df in dataframes.items():
        cols = ", ".join(f"{col} ({dtype})" for col, dtype in zip(df.columns, df.dtypes))
        description += f"- {name} → {cols}\n"
    return description

# === Helper function to return schema as string ===
async def get_csv_schema(file_urls: dict[str, str]) -> str:
    dataframes = await load_all_files_from_supabase(file_urls)
    if not dataframes:
        return "No valid CSV/Excel files loaded. Schema not available."
    schema_str = build_schema_description(dataframes)
    return schema_str