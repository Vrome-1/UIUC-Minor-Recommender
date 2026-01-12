import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print(f"Current working directory: {os.getcwd()}")
print(f".env file exists: {os.path.exists('.env')}")

# Check API key
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"API Key value (first 10 chars): {api_key[:10]}")
    print(f"API Key length: {len(api_key)}")
else:
    print("API Key is None or empty")

# Test google.generativeai import
try:
    import google.generativeai as genai
    print("Google Generative AI imported successfully")
except Exception as e:
    print(f"Error importing google.generativeai: {e}")