from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
import json_storage

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)  # Add this line to enable CORS for all routes

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with the API key
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize JSON files
json_storage.initialize_files()

def generate_unique_prompt(lesson):
    previous_sentences = json_storage.read_sentences()
    if previous_sentences:
        used_turkish_subjects = [entry['turkish'] for entry in previous_sentences if entry['lesson'] == lesson]
    else:
        used_turkish_subjects = []

    if used_turkish_subjects:
        used_subjects_str = ', '.join(used_turkish_subjects)
        prompt = (f"Generate a Turkish subject and provide its English translation. "
                  f"Ensure it is not one of the following: {used_subjects_str}. "
                  f"Return the sentence in a JSON format. Also return the Turkish word's plural suffix. "
                  f"JSON should be in the format: 'turkish': '...', 'english': '...', 'suffix': '...'. "
                  f"Provide unique and varied examples each time.")
    else:
        prompt = (f"Generate a Turkish subject and provide its English translation. "
                  f"Return the sentence in a JSON format. Also return the Turkish word's plural suffix. "
                  f"JSON should be in the format: 'turkish': '...', 'english': '...', 'suffix': '...'. "
                  f"Provide unique and varied examples each time.")
    
    return prompt

@app.route('/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    lesson = data['lesson']
    prompt = generate_unique_prompt(lesson)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant while I am learning Turkish."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    sentence_str = response.choices[0].message.content.strip()

    # Convert the string to JSON
    sentence_json = json.loads(sentence_str)

    # Save the sentence to the JSON file
    json_storage.write_sentence(lesson, sentence_json)
    return jsonify(sentence_json)

if __name__ == '__main__':
    app.run(debug=True)