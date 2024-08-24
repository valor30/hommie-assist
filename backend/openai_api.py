import openai
from chromadb import Client
from chromadb.utils import embedding_utils
import os

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize ChromaDB client
client = Client()
collection = client.get_collection("faq_data")

def get_relevant_context(user_input):
    embedding = embedding_utils.compute_embedding(user_input)
    results = collection.query(embedding=embedding, top_k=3)
    if results:
        return results[0]["answer"]
    return None

def generate_response(user_input):
    context = get_relevant_context(user_input)
    prompt = f"Answer the following question based on the provided context: {context}\n\nQuestion: {user_input}\nAnswer:"
    
    response = openai.Completion.create(
        model="gpt-4",
        prompt=prompt,
        max_tokens=150
    )

    return response.choices[0].text.strip()
