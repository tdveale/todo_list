# This file creates a Flask app and defines routes for creating, retrieving, and deleting todo items.
# Currently responses (200) are returned but an error occurs when trying to access the database (I think)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# create a new Flask app
app = Flask(__name__)

# set the SQLAlchemy database URI to todo.db in the current directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
# track modifications of objects 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

# create a class for todo items
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

# endpoint to create a new todo item
@app.route("/todo_items/", methods=["POST"])
# could do authentication here with auth0 and @requires_auth decorator but I don't have experience of this
def create_todo_item():
    """
    Create a new todo item.

    Returns:
        A JSON object containing the newly created todo item's id, created_at, updated_at, and title.
    """
    
    # get the data from the request body
    data = request.get_json()
    
    # try to create a new todo item with title
    try:
        todo_item = TodoItem(title=data["title"], details=data["details"])
        # add the new todo item to the database and commit changes
        db.session.add(todo_item)
        db.session.commit()
        
        # create a new dictionary containing the id, created_at, updated_at, and title of the new todo item
        new_item = {"id": todo_item.id, 
                    "created_at": todo_item.created_at, 
                    "updated_at": todo_item.updated_at, 
                    "title": todo_item.title,
                    "details": todo_item.details}
          
        # return a JSON response containing the new todo item
        return jsonify(new_item)
    
    # if there is an error, rollback the session and return an error message
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
@app.route("/todo_items/<int:todo_item_id>", methods=["GET"])
def get_todo_item(todo_item_id):
    """
    Retrieve a single todo item by ID.
    
    Args:
        todo_item_id (int): The ID of the todo item to retrieve.
        
    Returns:
        A JSON response containing the todo item's ID, creation and update timestamps, title, and details.
        If the todo item is not found, returns a JSON response with an error message and a 404 status code.
    """
    
    # retrieve the todo item with the given todo_item_id
    todo_item = TodoItem.query.get(todo_item_id)
    
    # if empty return error
    if todo_item is None:
        return jsonify({"error": "Todo item not found"}), 404
    
    # create dictionary for item id
    item = {"id": todo_item.id, 
            "created_at": todo_item.created_at, 
            "updated_at": todo_item.updated_at, 
            "title": todo_item.title, 
            "details": todo_item.details}
    
    # return a JSON response containing the todo item
    return jsonify(item)


@app.route("/todo_items/<int:task_id>", methods=["DELETE"])
def delete_todo_item(task_id):
    """
    Deletes a todo item with the given task_id from the database.

    Args:
        task_id (int): The id of the todo item to be deleted.

    Returns:
        A JSON response containing a message indicating whether the task was deleted successfully or an error message if the task was not found.
    """
    # get the todo item with the given task_id
    task = TodoItem.query.get(task_id)
    
    # if the todo item does not exist, return an error message
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    
    # delete the todo item from the database and commit changes
    db.session.delete(task)
    db.session.commit()
    
    # return a JSON response containing saying deletion was successful
    return jsonify({"message": "Task deleted successfully"})