
from flask import Flask
from flask_cors import CORS
from db.database import init_db
from routes.chatbot import chatbot_bp
from routes.faq import faq_bp

app = Flask(__name__)
CORS(app)



init_db()


app.register_blueprint(chatbot_bp)
app.register_blueprint(faq_bp)

if __name__=="__main__":
    app.run(port=5000, debug=True)
