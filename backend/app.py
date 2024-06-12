from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
from dotenv import load_dotenv
import random

from models.OpenAIClient.OpenAIClient import OpenAIClient

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)  # Add this line to enable CORS for all routes

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with the API key
#openai_client = OpenAIClient(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    previous_sentences = data.get('previousSentences', [])
    
    sentence_str = get_unique_subjects(previous_sentences)

    # get one randomly selected entry from the sentence_str list
    random_entry = random.choice(sentence_str)

    return jsonify(random_entry)

# Function that uses the OpenAIClient class and updates the learn_plural_subjects.json file with the new data
def generate_sentence_with_openai():
    sentence_str = read_learn_plural_subjects_data()
    
    prompt = OpenAIClient.generate_unique_prompt(previous_sentences=sentence_str)
    
    sentence_str = OpenAIClient.get_response(api_key=os.getenv('OPENAI_API_KEY'))

    with open(r'backend\data\learn_plural_subjects.json', 'w', encoding='utf-8') as f:
        json.dump(sentence_str, f, ensure_ascii=False, indent=4)

    return sentence_str

# Function that uses read_learn_plural_subjects_data() to get the data and removes elements that are already in the previous_sentences list
def get_unique_subjects(previous_sentences):
    sentence_str = read_learn_plural_subjects_data()

    # Remove the elements that are already in the previous_sentences list
    unique_sentence = [entry for entry in sentence_str if entry['turkish'] not in previous_sentences]

    return unique_sentence

# Function that reads the data from learn_plural_subjects.json file and places them in a global variable
def read_learn_plural_subjects_data():
    with open(r'backend\data\learn_plural_subjects.json', 'r', encoding='utf-8') as f:
        subjects = json.load(f)
        
    return subjects

@app.route('/get_saved_words', methods=['GET'])
def get_saved_words():
    with open(r'backend\data\learn_plural_subjects.json', 'r', encoding='utf-8') as f:
        words = json.load(f)
    return jsonify(words)

if __name__ == '__main__':
    app.run(debug=True)