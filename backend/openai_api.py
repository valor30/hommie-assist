import openai
from chromadb import Client
from chromadb.utils import embedding_functions
import os
from docx import Document

openai.api_key = os.getenv('OPENAI_API_KEY')

client = Client()
try:
    collection = client.get_collection("faq_data")
except ValueError:
    collection = client.create_collection("faq_data")

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def get_relevant_context(user_input):
    embedding = embedding_fn([user_input])
    
    try:
        results = collection.query(
            query_embeddings=embedding,
            top_k=3  
        )
    except TypeError:
        results = collection.query(
            query_embeddings=embedding
        )
    
    context = "\n".join(result['metadata']['answer'] for result in results.get('results', []))
    return context if context else "No relevant context found."

def detect_intent(user_input):
    context = get_relevant_context(user_input)
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Determine the user's intent based on the following input: {user_input}\n\nContext: {context if context else 'N/A'}"}
    ]
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        max_tokens=50
    )
    
    return response.choices[0].message['content'].strip()

def generate_response(user_input):
    context = get_relevant_context(user_input)
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Answer the following question based on the provided context: {context}\n\nQuestion: {user_input}\nAnswer:"}
    ]
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        max_tokens=150
    )
    
    return response.choices[0].message['content'].strip()

def get_docx_data(file_path):
    doc = Document(file_path)
    data = {}
    for para in doc.paragraphs:
        if para.text:
            if len(data) % 2 == 0:
                question = para.text
            else:
                data[question] = para.text
    return data
