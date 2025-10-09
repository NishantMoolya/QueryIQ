from sqlalchemy import text
from decimal import Decimal
from datetime import date
from sqlalchemy.engine import Engine
from typing import Union, List
import json


def json_serializer(obj):
    # Custom serializer for Decimal and date types
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError("Type not serializable")


def execute_query_sqlalchemy(engine: Engine, sql_query: Union[str, List[str]]) -> str:
    """
    Execute SQL query on given SQLAlchemy engine and return results as a JSON string.

    Parameters:
    - engine: SQLAlchemy Engine object
    - sql_query: SQL query as a string or list of strings

    Returns:
    - JSON string representing the query result
    """
    with engine.connect() as conn:
        try:
            # Ensure sql_query is a single string
            if isinstance(sql_query, list):
                sql_query = " ".join(sql_query)
            sql_query = sql_query.replace("```", "").strip()

            # Execute the query
            result = conn.execute(text(sql_query))
            rows = result.fetchall()
            keys = result.keys()

            # Convert rows to list of dictionaries
            data = [{key: val for key, val in zip(keys, row)} for row in rows]

            # Convert list of dicts to JSON string with custom serializer
            json_data = json.dumps(data, default=json_serializer)

            # Optional: Print JSON for debugging
            print(json_data)

            return json_data

        except Exception as e:
            print("❌ Error:", e)
            return "{}"  # Return empty JSON object string on error
