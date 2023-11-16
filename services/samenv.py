from dotenv import load_dotenv
import os

def get(key):
    load_dotenv()
    return os.getenv(key)