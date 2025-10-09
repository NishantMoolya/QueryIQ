from langchain.tools import tool

@tool
def add(a: int, b: int) -> int:
    """"Performs addition on the given parameters"""
    return a+b

result = add.invoke({'a':10,'b':20})

print(result)