# Generate SQL using Gemini with full schema context
from services.nl_to_sql_with_dynamic_schema import nl_to_sql_with_dynamic_schema
from services.query_execute import execute_query_sqlalchemy
from sqlalchemy import create_engine
from services.fetch_tables_and_schemas_sqlalchemy import fetch_tables_and_schemas_sqlalchemy

db_url = "postgresql+psycopg2://postgres:NLPEngineELITE@db.gwlufovbuzxrthoaafjf.supabase.co:5432/postgres"

async def sql_tester():
    schemas = fetch_tables_and_schemas_sqlalchemy(db_url)
    user_prompt="Provide details of employees"
    print("Fetched Schemas:")
    for table, schema in schemas.items():
        print(f"{table}{schema}")

    sql_query = nl_to_sql_with_dynamic_schema(user_prompt, schemas)
    print("Generated SQL:", sql_query)

    # Execute generated query using SQLAlchemy engine
    engine = create_engine(db_url)
    execute_query_sqlalchemy(engine, sql_query)
    
    return sql_query
