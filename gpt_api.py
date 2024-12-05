import base64
from openai import OpenAI
import streamlit as st

openai_api_key = st.secrets["OPENAI_API_KEY"]

client = OpenAI(api_key=openai_api_key)

def gpt_api_image(image_path):
    # Function to encode the image
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # Getting the base64 string
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "Extract in full the details of which is asked of the user, provide all text that is on the screen and all options",
            },
            {
            "type": "image_url",
            "image_url": {
                "url":  f"data:image/jpeg;base64,{base64_image}"
            },
            },
        ],
        }
    ],
    )
    return(response.choices[0].message.content)

def gpt_api_text(system_message, text):
    
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "{system_message}"},
            {
                "role": "user",
                "content": f"{text}"
            }
        ]
    )

    return(completion.choices[0].message.content)

def gpt_api_solver(text):
    
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You have been given the following question, which option is best suited for the question at hand. Please provide the answer in full."},
            {
                "role": "user",
                "content": f"{text}"
            }
        ]
    )

    return(completion.choices[0].message.content)

