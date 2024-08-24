import chromadb
from chromadb.utils import embedding_functions
from utils.data_processing import extract_text_from_docx

client = chromadb.Client()

try:
    collection = client.get_collection("faq_data")
except ValueError:
    collection = client.create_collection("faq_data")

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def prepare_data(file_path):
    faq_data = extract_text_from_docx(file_path)  
    faq_data_list = []
    for question, answer in faq_data.items():
        faq_data_list.append({"question": question, "answer": answer})
    return faq_data_list

def insert_data_into_chromadb(data):
    for entry in data:
        question = entry['question']
        answer = entry['answer']
        embedding = embedding_fn([question])  
        collection.add(
            embeddings=embedding,
            metadatas={"question": question, "answer": answer}
        )

if __name__ == "__main__":
    faq_data = prepare_data("data/faq_data.docx")
    insert_data_into_chromadb(faq_data)
    print("FAQ data has been successfully inserted into ChromaDB.")
