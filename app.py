from flask import Flask, request, jsonify
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
from dotenv import load_dotenv
import os
import json_storage

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize JSON files
json_storage.initialize_files()

@app.route('/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    lesson = data['lesson']
    prompt = f"Generate a Turkish subject and provide its English translation. return the sentence in a json format."

    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant while I am learning tukish."},
        {"role": "user", "content": prompt}
    ])
    sentence = response.choices[0].message.content.strip()

    # Save the sentence to the JSON file
    json_storage.write_sentence(lesson, sentence)
    return jsonify({'sentence': sentence})

@app.route('/update_progress', methods=['POST'])
def update_progress():
    data = request.json
    lesson = data['lesson']
    progress = data['progress']

    json_storage.write_progress(lesson, progress)
    return jsonify({'message': 'Progress updated'})

if __name__ == '__main__':
    app.run(debug=True)