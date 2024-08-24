import sqlite3

def init_db():
    conn = sqlite3.connect('db/chatbot.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_lead(name, email, phone, service):
    conn = sqlite3.connect('db/chatbot.db')
    c = conn.cursor()
    c.execute('INSERT INTO leads (name, email, phone, service) VALUES (?, ?, ?, ?)', 
              (name, email, phone, service))
    conn.commit()
    conn.close()
