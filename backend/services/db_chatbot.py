# Generate SQL using Gemini with full schema context
from services.nl_to_sql_with_dynamic_schema import nl_to_sql_with_dynamic_schema
from services.query_execute import execute_query_sqlalchemy
from sqlalchemy import create_engine
from services.fetch_tables_and_schemas_sqlalchemy import fetch_tables_and_schemas_sqlalchemy

async def db_chat(db_url: str, schemas: str, user_query: str):
    sql_query = nl_to_sql_with_dynamic_schema(user_query, schemas)
    print("Generated SQL:", sql_query)

    # Execute generated query using SQLAlchemy engine
    engine = create_engine(db_url)
    data_json = execute_query_sqlalchemy(engine, sql_query)

    return data_json
