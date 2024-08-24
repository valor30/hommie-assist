from docx import Document

def extract_text_from_docx(file_path):
    document = Document(file_path)
    faq_data = {}

    for para in document.paragraphs:
        if para.text.startswith("Q:"):
            question = para.text[2:].strip()
        elif para.text.startswith("A:"):
            answer = para.text[2:].strip()
            faq_data[question] = answer

    return faq_data
