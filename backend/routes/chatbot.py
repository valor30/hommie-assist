from flask import Blueprint, request, jsonify
import openai
from db.database import add_lead
from dotenv import load_dotenv
import os


load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)


openai.api_key = os.getenv('OPENAI_API_KEY')

@chatbot_bp.route('/api/message', methods=['POST'])
def handle_message():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for home improvement."},
            {"role": "user", "content": user_message}
        ]
    )

    bot_message = response['choices'][0]['message']['content']
    return jsonify({'message': bot_message})

@chatbot_bp.route('/api/lead', methods=['POST'])
def capture_lead():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    service = data.get('service')

    if not all([name, email, phone, service]):
        return jsonify({'error': 'Missing information'}), 400

    add_lead(name, email, phone, service)
    return jsonify({'success': 'Lead captured successfully'})
