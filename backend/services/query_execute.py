from sqlalchemy import create_engine, inspect, text
from decimal import Decimal
from sqlalchemy.engine import Engine

def execute_query_sqlalchemy(engine: Engine, sql_query: str):
    """
    Execute SQL query on given SQLAlchemy engine and print results.
    """
    with engine.connect() as conn:
        try:
            result = conn.execute(text(sql_query))
            rows = result.fetchall()
            keys = result.keys()

            print("\t".join(keys))
            for row in rows:
                row_printable = [float(val) if isinstance(val, Decimal) else val for val in row]
                print("\t".join(map(str, row_printable)))

            return rows
        except Exception as e:
            print("❌ Error:", e)