import streamlit as st
import os
import pandas as pd
from PyPDF2 import PdfReader
from gpt_api import gpt_api_text

# Title of the Streamlit app
st.title("Interim Report Analysis")

# Folder containing the PDF files
folder_path = "interim_reports/"

# Check if the folder exists
if not os.path.exists(folder_path):
    st.error(f"The folder '{folder_path}' does not exist.")
else:
    # Initialize an empty list to store analysis data
    analysis_data = []

    # Iterate through all PDF files in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(folder_path, filename)
            
            # Read the PDF file and extract text
            try:
                reader = PdfReader(file_path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                
                # Word count
                word_count = len(text.split())
                
                # Generate report structure using GPT API
                interim_structure = gpt_api_text(
                    "You are reviewing the following interim report to understand the structure, "
                    "your intention is to return the structure that makes up the report. Does it include an introduction, "
                    "does it include a literature review, etc.? Your response will be the sections that make up the report and no further explanation. "
                    "You will now be provided the report.",
                    text
                )

                # Generate a short blurb using GPT API
                blurb = gpt_api_text(
                    "You are reviewing the following interim report. You will return a short 200-word blurb on what the report covered. "
                    "You will now be provided the report.",
                    text
                )

                # Append the analysis data to the list
                analysis_data.append({
                    "Report Name": filename,
                    "Word Count": word_count,
                    "Report Structure": interim_structure,
                    "Blurb": blurb
                })

            except Exception as e:
                st.error(f"Error reading {filename}: {e}")

    # Convert analysis data into a DataFrame
    if analysis_data:
        df = pd.DataFrame(analysis_data)
        
        # Display the table
        st.dataframe(df)
    else:
        st.warning("No valid PDF files found in the folder.")
