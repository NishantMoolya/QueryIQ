import os
from openai import OpenAI

os.environ['NEBIUS_API_KEY'] = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNjA4NDY0MTIwMDI0Mjg0NDE3NyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkwNTUyMjUwNywidXVpZCI6ImIwZTE1NzhkLWRiODQtNDgyZi1iYWRiLWU4MTVlZDQyNWY1MCIsIm5hbWUiOiJmbHV4X3NjaG5lbGwiLCJleHBpcmVzX2F0IjoiMjAzMC0wNS0yMFQxNTo0ODoyNyswMDAwIn0.ynFxRaI44FBld9EUnW8xz2nUIH6UtX7LEcM7BCGlo80"

client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"),
)

print(client)

# completion = client.chat.completions.create(
#     model="meta-llama/Llama-3.2-1B-Instruct",
#     messages=[
#         {
#           "role": "system",
#           "content": "You are a chemistry expert. Add jokes about cats to your responses from time to time."
#         },
#         {
#           "role": "user",
#           "content": "Hello!"
#         },
#         {
#           "role": "assistant",
#           "content": "Hello! How can I assist you with chemistry today? And did you hear about the cat who became a chemist? She had nine lives, but she only needed one formula!"
#         }
#     ],
#     max_tokens=100,
#     temperature=1,
#     top_p=1,
#     # top_k=50,
#     n=1,
#     stream=False,
#     stream_options=None,
#     stop=None,
#     presence_penalty=0,
#     frequency_penalty=0,
#     logit_bias=None,
#     logprobs=False,
#     top_logprobs=None,
#     user=None,
#     response_format={
#         "type": "json_object"
#     }
# )

# print(completion.to_json())
