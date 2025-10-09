from sqlalchemy import create_engine, inspect

def fetch_tables_and_schemas_sqlalchemy(db_url: str) -> dict:
    """
    Connect to a database using SQLAlchemy and fetch all tables and their schemas dynamically.
    Returns {table_name: schema_string}
    """
    engine = create_engine(db_url)
    inspector = inspect(engine)
    
    schemas = {}
    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        # Build simplified schema: column_name TYPE [NOT NULL]
        column_defs = []
        for col in columns:
            col_name = col['name']
            col_type = str(col['type']).upper()
            not_null = ' NOT NULL' if not col.get('nullable', True) else ''
            column_defs.append(f"{col_name} {col_type}{not_null}")
        
        schemas[table_name] = f"{table_name}({', '.join(column_defs)})"
    
    return schemas

# checking the function is working by calling it with an example url.
# db_url = "mysql+pymysql://root:ADITIUSESMYSQL@127.0.0.1:3306/dbnew"
# schemas = fetch_tables_and_schemas_sqlalchemy(db_url)
# print("Fetched Schemas:")
# for table, schema in schemas.items():
#     print(f"{table}{schema}")