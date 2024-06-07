from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)  # Add this line to enable CORS for all routes

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with the API key
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_unique_prompt(previous_sentences):
    used_turkish_subjects = [entry['turkish'] for entry in previous_sentences]

    if used_turkish_subjects:
        used_subjects_str = ', '.join(used_turkish_subjects)
        prompt = (f"Generate a Turkish subject and provide its English translation. "
                  f"Ensure it is not one of the following: {used_subjects_str}. "
                  f"Return the sentence in a JSON format. Also return the Turkish word's plural suffix and the English word in plural. "
                  f"JSON should be in the format: 'turkish': '...', 'english': '...', 'turkishsuffix': '...', 'englishplural': '...'. "
                  f"Provide unique and varied examples each time.")
    else:
        prompt = (f"Generate a Turkish subject and provide its English translation. "
                  f"Return the sentence in a JSON format. Also return the Turkish word's plural suffix and the English word in plural. "
                  f"JSON should be in the format: 'turkish': '...', 'english': '...', 'turkishsuffix': '...', 'englishplural': '...'. "
                  f"Provide unique and varied examples each time.")

    return prompt

@app.route('/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    lesson = data['lesson']
    previous_sentences = data.get('previousSentences', [])
    prompt = generate_unique_prompt(previous_sentences)

    response = client.chat_completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant while I am learning Turkish."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    sentence_str = response.choices[0].message['content'].strip()

    # Fix the JSON string to use double quotes instead of single quotes
    sentence_str = sentence_str.replace("'", '"')

    # Convert the string to JSON
    sentence_json = json.loads(sentence_str)

    return jsonify(sentence_json)

# function that reads the data from learn_plural_subjects.json file and places them in a global variable
def read_learn_plural_subjects_data():
    global words
    with open(r'backend\data\learn_plural_subjects.json', 'r', encoding='utf-8') as f:
        words = json.load(f)

@app.route('/get_saved_words', methods=['GET'])
def get_saved_words():
    with open(r'backend\data\learn_plural_subjects.json', 'r', encoding='utf-8') as f:
        words = json.load(f)
    return jsonify(words)

if __name__ == '__main__':
    app.run(debug=True)
