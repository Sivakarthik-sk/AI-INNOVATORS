from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Set your Gemini API key (using environment variable)
gemini_api_key = os.getenv("AIzaSyD4tfT742jsUCItKboQPhbvYoPlJBlivOI")
gemini_url = "https://api.gemini.com/v1/chat/completions"  # Example endpoint

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get user input from the request
        user_input = request.json.get('message')
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        # Prepare the data to send to the Gemini API
        payload = {
            "model": "gemini-3",  # Assuming the model name for Gemini
            "messages": [
                {"role": "system", "content": "You are a helpful assistant for OLabs (Online Labs)."},
                {"role": "user", "content": user_input}
            ]
        }

        headers = {
            "Authorization": f"Bearer {gemini_api_key}",
            "Content-Type": "application/json"
        }

        # Send the request to the Gemini API
        response = requests.post(gemini_url, json=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            response_data = response.json()
            return jsonify({"response": response_data['choices'][0]['message']['content']})
        else:
            return jsonify({"error": "Error from Gemini API", "details": response.text}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
