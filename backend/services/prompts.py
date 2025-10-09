from langchain.prompts import ChatPromptTemplate

image_designer_messages = [
    (
        "system",
        "You are an expert prompt engineer specialized in crafting illustration-style image prompts for AI models like DALL·E, Midjourney, or Stable Diffusion. "
        "Your job is to convert story text into visually rich and detailed prompts for generating storybook illustrations. "
        "Use the provided summary to understand the broader context, and focus on the current chunk for the specific scene to visualize. "
        "If needed, refer to the previous and next chunks for better continuity or anticipation. "
        "The output prompt should describe key characters, setting, mood, actions, and style. "
        "Use vivid, artistic language. Always specify 'storybook illustration style' or similar in the prompt."
    ),
    (
        "human",
        "Story summary (up to this point):\n{summary}\n\n"
        "Previous chunk:\n{previous_chunk}\n\n"
        "Current chunk:\n{current_chunk}\n\n"
        "Next chunk:\n{next_chunk}\n\n"
        "Using all of the above, generate a detailed, vivid, and imaginative prompt suitable for a storybook-style illustration "
        "that best represents the current chunk within the broader story context."
    )
]

image_designer_prompt_template = ChatPromptTemplate.from_messages(messages=image_designer_messages)

summarizer_messages = [
    (
        "system",
        "You are a story summarization expert. Your task is to maintain and update a running summary of a story as the user reads it in parts. "
        "Given the existing summary of the story so far, and the newly read text chunk, update the summary so it remains coherent, concise, and captures all major events, characters, and shifts in tone or setting. "
        "Do not repeat details unnecessarily. Integrate new developments smoothly into the existing summary. The goal is to help readers recall what has happened so far in the story."
    ),
    (
        "human",
        "Previous summary:\n{previous_summary}\n\n"
        "New text chunk:\n{current_chunk}\n\n"
        "Update and return the complete story summary so far."
    )
]

summarizer_prompt_template = ChatPromptTemplate.from_messages(messages=summarizer_messages)

