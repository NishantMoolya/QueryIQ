# from sqlalchemy import text
# from decimal import Decimal
# from sqlalchemy.engine import Engine

# def execute_query_sqlalchemy(engine: Engine, sql_query: str):
#     """
#     Execute SQL query on given SQLAlchemy engine and print results.
#     """
#     with engine.connect() as conn:
#         try:
#             # Ensure sql_query is a string
#             if isinstance(sql_query, list):
#                 sql_query = " ".join(sql_query)

#             sql_query = sql_query.replace("```", "").strip()
#             result = conn.execute(text(sql_query))
#             rows = result.fetchall()
#             keys = result.keys()

#             print("\t".join(keys))
#             for row in rows:
#                 row_printable = [float(val) if isinstance(val, Decimal) else val for val in row]
#                 print("\t".join(map(str, row_printable)))

#             return rows

#         except Exception as e:
#             print("❌ Error:", e)
#             return "Error"


# from sqlalchemy import text
# from decimal import Decimal
# from sqlalchemy.engine import Engine
# from typing import Union, List, Dict, Any
# import json

# def execute_query_sqlalchemy(engine: Engine, sql_query: Union[str, List[str]]) -> List[Dict[str, Any]]:
#     """
#     Execute SQL query on given SQLAlchemy engine and return results as a list of dictionaries.
    
#     Parameters:
#     - engine: SQLAlchemy Engine object
#     - sql_query: SQL query as a string or list of strings
    
#     Returns:
#     - List of dictionaries, each dict representing a row {column_name: value}
#     """
#     with engine.connect() as conn:
#         try:
#             # Ensure query is a single string
#             if isinstance(sql_query, list):
#                 sql_query = " ".join(sql_query)
            
#             sql_query = sql_query.replace("```", "").strip()
            
#             # Execute
#             result = conn.execute(text(sql_query))
#             rows = result.fetchall()
#             keys = result.keys()
            
#             # Convert rows to list of dicts
#             data = []
#             for row in rows:
#                 row_dict = {key: float(val) if isinstance(val, Decimal) else val for key, val in zip(keys, row)}
#                 data.append(row_dict)
            
#             # Optional: Print nicely
#             print("\t".join(keys))
#             for row in data:
#                 print("\t".join(map(str, row.values())))

             
#             return data
        

#         except Exception as e:
#             print("❌ Error:", e)
#             return []


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
