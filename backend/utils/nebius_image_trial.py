import os
from openai import OpenAI


client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"),
)

print(client)

completion = client.images.generate(
    model="black-forest-labs/flux-schnell",
    prompt="create a illustrative style image of a batsman getting hit by a ball on his head while playing cricket",
    # response_format="b64_json",
    response_format="url",
    extra_body={
        "response_extension": "webp",
        "width": 512,
        "height": 512,
        "num_inference_steps": 4,
        "seed": -1,
        "negative_prompt": "Giraffes, night sky"
    }
)

print(completion.to_json())

# os.environ['NEBIUS_API_KEY'] = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNjA4NDY0MTIwMDI0Mjg0NDE3NyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkwNTUyMjUwNywidXVpZCI6ImIwZTE1NzhkLWRiODQtNDgyZi1iYWRiLWU4MTVlZDQyNWY1MCIsIm5hbWUiOiJmbHV4X3NjaG5lbGwiLCJleHBpcmVzX2F0IjoiMjAzMC0wNS0yMFQxNTo0ODoyNyswMDAwIn0.ynFxRaI44FBld9EUnW8xz2nUIH6UtX7LEcM7BCGlo80"