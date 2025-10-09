from models.files_models import ImageGeneratorOuput
from services.agents import createAgents
from core.config import settings
from openai import OpenAI
    
async def image_generator(previous_summary: str, current_chunk: str, previous_chunk: str ="", next_chunk: str ="") -> ImageGeneratorOuput:
    agents = createAgents()
    # print(agents)
    updated_summary = await agents["story_summarizer"].ainvoke({
        "previous_summary": previous_summary,
        "current_chunk": current_chunk
    })
    
    # print(f"summarizer {updated_summary}")
    
    illustration_prompt = await agents["image_designer"].ainvoke({
        "summary": updated_summary,  # ensure we pass final content
        "previous_chunk": previous_chunk,
        "current_chunk": current_chunk,
        "next_chunk": next_chunk
    })
    # print(f"designer {illustration_prompt}")
   
    
    # pass the illustration_prompt to the text-to-image model and get the image
    img_url = await generate_image_url(prompt=illustration_prompt)
    print(f"image: {img_url}")
    
    return ImageGeneratorOuput(summary=updated_summary,image=img_url)

async def generate_image_url(prompt: str, negative_prompt: str = "") -> str:
    try:
        client = OpenAI(
            base_url="https://api.studio.nebius.com/v1/",
            api_key=settings.NEBIUS_API_KEY,
        )
        response = client.images.generate(
            model=settings.IMAGE_MODEL_ID,
            prompt=prompt,
            response_format="url",
            extra_body={
                "response_extension": "webp",
                "width": 512,
                "height": 512,
                "num_inference_steps": 4,
                "seed": -1,
                "negative_prompt": negative_prompt
            }
        )
        # Extract the URL from the response
        image_url = response.data[0].url
        return image_url
    except Exception as e:
        print(f"Image generation failed: {e}")
        return "hello"
