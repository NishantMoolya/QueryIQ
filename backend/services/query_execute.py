from sqlalchemy import text
from decimal import Decimal
from datetime import date
from sqlalchemy.engine import Engine
from typing import Union, List, Any


def json_serializer(obj):
    # Custom serializer for Decimal and date types
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError("Type not serializable")


def execute_query_sqlalchemy(engine: Engine, sql_query: Union[str, List[str]]) -> List[dict]:
    """
    Execute SQL query on given SQLAlchemy engine and return results as a list of dictionaries.

    Parameters:
    - engine: SQLAlchemy Engine object
    - sql_query: SQL query as a string or list of strings

    Returns:
    - List of dictionaries representing the query result
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

            # Convert rows to list of dictionaries with serialization
            data = [
                {key: json_serializer(val) if isinstance(val, (Decimal, date)) else val for key, val in zip(keys, row)}
                for row in rows
            ]

            # Optional: Print data for debugging
            print("Query Result:", data)

            return data

        except Exception as e:
            print("Error executing query:", e)
            return []
