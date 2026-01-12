import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {'Yes' if api_key else 'No'}")

if api_key:
    try:
        genai.configure(api_key=api_key)
        print("API configured successfully")

        # List available models
        print("Available models:")
        for model in genai.list_models():
            print(f"  - {model.name}")

        # Try to use gemini-1.0-pro
        model = genai.GenerativeModel('gemini-1.0-pro')
        response = model.generate_content("Hello, test message")
        print(f"Test response: {response.text}")

    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API key found")