from flask import Flask, request, jsonify
from datetime import datetime
import json
import sqlite3

# Create a sqlite database for storing todo items
conn = sqlite3.connect('todo.db')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS todo_items
             (id INTEGER PRIMARY KEY, title TEXT, details TEXT, created_at TEXT, updated_at TEXT)''')

conn.commit()
conn.close()

# create a Flask app
app = Flask(__name__)

# Dummy data to simulate a database
# todo_items = [
#     {"id": 1, "title": "Todo Item 1", "details": "Details for Todo Item 1"},
#     {"id": 2, "title": "Todo Item 2", "details": "Details for Todo Item 2"}
# ]

# API Endpoints
# returns empty json object to test if the server is running
@app.route("/", methods=["GET"])
def read_root():
    return jsonify({})

# create item endpoint
# associated CURL cmd: curl -X POST -H "Content-Type: application/json" -d '{"title": "Test item", "details": "This is a test item"}' http://localhost:8000/todo_items/
@app.route("/todo_items/", methods=["POST"])
def create_item():
    data = request.get_json()
    title = data.get("title")
    details = data.get("details", "")
    created_at = datetime.now().isoformat()
    updated_at = datetime.now().isoformat()
    print('before conn')
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute("INSERT INTO todo_items (title, details, created_at, updated_at) VALUES (?, ?, ?, ?)", (title, details, created_at, updated_at))
    #c.execute("INSERT INTO todo_items (title, details) VALUES (?, ?)", (title, details))
    item_id = c.lastrowid
    conn.commit()
    conn.close()
    print('after conn')
    new_item = {
        "id": item_id,
        "title": title,
        "details": details,
        "created_at": created_at,
        "updated_at": updated_at
    }
    return jsonify(new_item)

# simple version
# @app.route("/todo_items/", methods=["POST"])
# def create_item():
#     data = request.get_json()
#     title = data.get("title")
#     details = data.get("details", "")
#     new_item = {
#         "id": len(todo_items) + 1,
#         "title": title,
#         "details": details
#     }
#     todo_items.append(new_item)
#     return jsonify(new_item)

# read all items endpoint
@app.route("/todo_items/<int:item_id>", methods=["GET"])
def read_item(item_id):
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute("SELECT * FROM todo_items WHERE id=?", (item_id,))
    item = c.fetchone()
    conn.close()
    if item:
        new_item = {
            "id": item[0],
            "title": item[1],
            "details": item[2],
            "created_at": item[3],
            "updated_at": item[4]
        }
        return jsonify(new_item)
    else:
        return jsonify({"error": "Item not found"}), 404

# Read all items endpoint
# associated CURL cmd: curl http://localhost:8000/todo_items
@app.route("/todo_items", methods=["GET"])
def read_all_items():
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute("SELECT * FROM todo_items")
    items = []
    for row in c.fetchall():
        item = {
            "id": row[0],
            "title": row[1],
            "details": row[2],
            "created_at": row[3],
            "updated_at": row[4]
        }
        items.append(item)
    conn.close()
    return jsonify(items)

# # Note: Flask doesn't have built-in support for PATCH requests, you can implement it using a POST request with method override

# # update item endpoint
# @app.route("/todo_items/<int:item_id>", methods=["POST"])
# def update_item(item_id):
#     data = request.get_json()
#     title = data.get("title")
#     details = data.get("details")

#     item = next((item for item in todo_items if item["id"] == item_id), None)
#     if item:
#         item["title"] = title if title else item["title"]
#         item["details"] = details if details else item["details"]
#         item["updated_at"] = datetime.now().isoformat()
#         return jsonify(item)
#     else:
#         return jsonify({"error": "Item not found"}), 404

# delete item endpoint
# associated CURL cmd: curl -X DELETE http://localhost:8000/todo_items/1
@app.route("/todo_items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute("DELETE FROM todo_items WHERE id=?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item deleted successfully"})

# run app
if __name__ == "__main__":
    
    app.run(debug=True)
