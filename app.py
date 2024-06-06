from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
import json_storage

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with the API key
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize JSON files
json_storage.initialize_files()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    lesson = data['lesson']
    prompt = f"Generate a Turkish subject and provide its English translation. Return the sentence in a JSON format. Also return the turkish words plural sufix. Json should be in the format: 'turkish': '...', 'english': '...', 'suffix': '...'"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant while I am learning Turkish."},
            {"role": "user", "content": prompt}
        ]
    )
    sentence_str = response.choices[0].message.content.strip()

    # Convert the string to JSON
    sentence_json = json.loads(sentence_str)

    # Save the sentence to the JSON file
    json_storage.write_sentence(lesson, sentence_json)
    return jsonify(sentence_json)

@app.route('/update_progress', methods=['POST'])
def update_progress():
    data = request.json
    lesson = data['lesson']
    progress = data['progress']

    json_storage.write_progress(lesson, progress)
    return jsonify({'message': 'Progress updated'})

if __name__ == '__main__':
    app.run(debug=True)
