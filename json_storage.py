import json
from pathlib import Path

DATA_DIR = Path("data")
PROGRESS_FILE = DATA_DIR / "progress.json"
SENTENCES_FILE = DATA_DIR / "sentences.json"

DATA_DIR.mkdir(exist_ok=True)

def initialize_files():
    if not PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'w') as file:
            json.dump({}, file)
    if not SENTENCES_FILE.exists():
        with open(SENTENCES_FILE, 'w') as file:
            json.dump([], file)

def read_progress():
    with open(PROGRESS_FILE, 'r') as file:
        return json.load(file)

def write_progress(lesson, progress):
    data = read_progress()
    data[lesson] = progress
    with open(PROGRESS_FILE, 'w') as file:
        json.dump(data, file)

def read_sentences():
    with open(SENTENCES_FILE, 'r') as file:
        return json.load(file)

def write_sentence(lesson, sentence):
    data = read_sentences()
    sentence['lesson'] = lesson
    data.append(sentence)
    with open(SENTENCES_FILE, 'w') as file:
        json.dump(data, file)
