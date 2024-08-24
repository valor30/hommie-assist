import warnings
from flask import Blueprint, request, jsonify
import chromadb
from chromadb.utils import embedding_functions  

warnings.filterwarnings("ignore", category=FutureWarning, module='transformers.tokenization_utils_base')
faq_bp = Blueprint('faq', __name__)


client = chromadb.Client()


collection_name = "faqs_db"
existing_collections = client.list_collections()  

if collection_name not in existing_collections:
    
    db = client.create_collection(name=collection_name)
else:
   
    db = client.get_collection(name=collection_name)


embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")


def store_faqs(faqs):
    for faq in faqs:
        question_embedding = embedding_fn([faq['question']])[0] 
        answer_embedding = embedding_fn([faq['answer']])[0]  
        db.add(
            id=f"faq_{faq['question']}", 
            embedding=answer_embedding,
            metadata={"text": faq['answer']}
        )

@faq_bp.route('/api/faq', methods=['GET'])
def retrieve_faq():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    
    query_embedding = embedding_fn([query])[0] 

    
    results = db.query(embedding=query_embedding, top_k=1)
    
    if results:
        answer = results[0]['metadata']['text']  
        return jsonify({'answer': answer})
    else:
        return jsonify({'answer': 'Sorry, I do not have an answer to that question.'})
