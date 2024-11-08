import streamlit as st

from gpt_api import gpt_api_call

print(response.choices[0])

st.title("Upload Files")

# choose file from browser
uploaded_file = st.file_uploader("Choose a file") 

