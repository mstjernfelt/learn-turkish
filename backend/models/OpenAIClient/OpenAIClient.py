import openai

class OpenAIClient:
    def __init__(self, api_key):
        self.client = openai
        self.client.api_key = api_key

    def generate_unique_prompt(self, previous_sentences):
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

    def get_response(self, prompt):
        response = self.client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant while I am learning Turkish."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        return response.choices[0].message.content.strip()