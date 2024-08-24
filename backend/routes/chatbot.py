from flask import Blueprint, request, jsonify, render_template
import openai
from db.database import add_lead
from dotenv import load_dotenv
import os
import logging
from openai_api import detect_intent, get_docx_data
from werkzeug.utils import secure_filename
from PIL import Image
import io

load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)

openai.api_key = os.getenv('OPENAI_API_KEY')

logging.basicConfig(level=logging.INFO)

@chatbot_bp.route('/api/message', methods=['POST'])
def handle_message():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        intent = detect_intent(user_message)
    except Exception as e:
        logging.error(f'Error detecting intent: {e}')
        return jsonify({'error': 'Error detecting intent'}), 500

    if intent == 'ask-about-repairing':
        return jsonify({'response': 'form_prompt'})
    else:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for home improvement."},
                    {"role": "user", "content": user_message}
                ]
            )
        except Exception as e:
            logging.error(f'Error calling OpenAI API: {e}')
            return jsonify({'error': 'Error calling OpenAI API'}), 500
        bot_message = response['choices'][0]['message']['content']
        return jsonify({'message': bot_message})

@chatbot_bp.route('/api/image', methods=['POST'])
def handle_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filename = secure_filename(file.filename)
        image = Image.open(file.stream)
        intent = process_image(image)
        
        if intent == 'ask-about-repairing':
            return jsonify({'response': 'form_prompt'})
        else:
            response = openai.Completion.create(
                model="gpt-4",
                prompt=f"User uploaded an image. Based on this image, provide a response.",
                max_tokens=150
            )
            return jsonify({'message': response.choices[0].text.strip()})
    
    return jsonify({'error': 'Unsupported file type'}), 400

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

@chatbot_bp.route('/api/docx', methods=['GET'])
def get_docx_content():
    docx_path = 'backend/data/faq_data.docx'
    content = get_docx_data(docx_path)
    return jsonify({'content': content})

def process_image(image):
    
    return 'ask-about-repairing'  

