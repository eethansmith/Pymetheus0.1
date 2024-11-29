import streamlit as st
from gpt_api import gpt_api_image, gpt_api_text
import os

st.title("Upload Files")

# Choose file from browser
uploaded_file = st.file_uploader("Choose a file") 

if uploaded_file:
    # Define the local path to save the uploaded file
    save_path = os.path.join("uploads", uploaded_file.name)
    
    # Ensure the 'uploads' directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Write the uploaded file to the local directory
    with open(save_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    # Pass the file path to gpt_api_call
    response = gpt_api_image(save_path)
    
    st.write(response)
    
    response = gpt_api_text(response)
    st.write(response)