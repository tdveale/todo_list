from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)


class TodoItem(db.Model):
    """
    Represents a single item in a todo list.

    Attributes:
        id (int): The unique identifier for the todo item.
        title (str): The title of the todo item.
        details (str): The details of the todo item.
        created_at (datetime): The date and time when the todo item was created.
        updated_at (datetime): The date and time when the todo item was last updated.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    details = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
@app.route("/todo_items/", methods=["POST"])
def create_todo_item():
    """
    Create a new todo item.

    Returns:
        A JSON object containing the newly created todo item's id, created_at, updated_at, and title.
    """
    data = request.get_json()
    todo_item = TodoItem(title=data["title"])
    db.session.add(todo_item)
    db.session.commit()
    
    new_item = {"id": todo_item.id, 
                "created_at": todo_item.created_at, 
                "updated_at": todo_item.updated_at, 
                "title": todo_item.title}
    
    return jsonify(new_item)

@app.route("/todo_items/", methods=["GET"])
def get_todo_items():
    """
    Retrieve all todo items from the database and return them as a JSON response.
    
    Returns:
        A JSON response containing a list of all todo items in the database.
    """
    todo_items = TodoItem.query.all()
    
    all_items = [{"id": todo_item.id, "created_at": todo_item.created_at, "updated_at": todo_item.updated_at, "title": todo_item.title} for todo_item in todo_items]
    
    return jsonify(all_items)


@app.route("/todo_items/<int:task_id>", methods=["DELETE"])
def delete_todo_item(task_id):
    """
    Deletes a todo item with the given task_id from the database.

    Args:
        task_id (int): The id of the todo item to be deleted.

    Returns:
        A JSON response containing a message indicating whether the task was deleted successfully or an error message if the task was not found.
    """
    task = TodoItem.query.get(task_id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"})