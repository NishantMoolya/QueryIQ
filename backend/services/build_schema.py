def build_schema_prompt(schemas: str) -> str:
    """
    Combine multiple table schemas into a formatted prompt string.
    """
    schema_parts = [schema for schema in schemas.values()]
    combined_schema = "\n".join(schema_parts)
    return f"Tables:\n{combined_schema}\n"