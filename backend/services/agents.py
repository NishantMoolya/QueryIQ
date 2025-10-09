from services.prompts import summarizer_prompt_template, image_designer_prompt_template
from services.output_parsers import output_parser
from services.llms import createLLM

def createAgents():
    try:
        chat_llm = createLLM()
        if chat_llm is not None:
            # Chain 1: Summary Updater
            story_summarizer = summarizer_prompt_template | chat_llm | output_parser

            # Chain 2: Image Prompt Generator
            image_designer = image_designer_prompt_template | chat_llm | output_parser
            
            print("Agents initialized")
            return { "story_summarizer": story_summarizer,
                     "image_designer": image_designer
                    }
        else:
            print("No LLM found")
            return { 
                     "story_summarizer": None,
                     "image_designer": None
                    }
    except Exception as e:
        print(f"Agents initialization failed: {str(e)}")
        return { 
                "story_summarizer": None,
                "image_designer": None
            }


# agent that help in desiging image prompt for text-to-image model
# image_designer = prompt_template | chat_llm | output_parser

# # agent that summarizes the story until now
# story_summarizer = prompt_template | chat_llm | output_parser

# res = story_summarizer.invoke({"input": "what is ML"})
