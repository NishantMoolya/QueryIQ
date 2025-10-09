# Generate SQL using Gemini with full schema context
from nl_to_sql_with_dynamic_schema import nl_to_sql_with_dynamic_schema
from query_execute import execute_query_sqlalchemy
from sqlalchemy import create_engine
from fetch_tables_and_schemas_sqlalchemy import fetch_tables_and_schemas_sqlalchemy



db_url = "mysql+pymysql://root:ADITIUSESMYSQL@127.0.0.1:3306/dbnew"

schemas = fetch_tables_and_schemas_sqlalchemy(db_url)
user_prompt="Provide details of department id 1 including name and location"
print("Fetched Schemas:")
for table, schema in schemas.items():
    print(f"{table}{schema}")

sql_query = nl_to_sql_with_dynamic_schema(user_prompt, schemas)
print("Generated SQL:", sql_query)

# Execute generated query using SQLAlchemy engine
engine = create_engine(db_url)
execute_query_sqlalchemy(engine, sql_query)
