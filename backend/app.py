from datetime import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so our React app can safely send data requests
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    # A helper method to convert our database row objects into readable Python Dictionaries
    def to_json(self):
        return {
            "id": self.id,
            "content": self.content,
            "date_created": self.date_created.strftime('%Y-%m-%d %H:%M')
        }

# ==========================================
# REST API ENDPOINTS
# ==========================================

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        # Grab data out of incoming JSON payload body
        data = request.json
        if not data or 'content' not in data:
            return jsonify({"error": "Content is required"}), 400
            
        new_task = Todo(content=data['content'])
        try:
            db.session.add(new_task)
            db.session.commit()
            return jsonify(new_task.to_json()), 201
        except:
            return jsonify({"error": "Could not add task"}), 500
    else:
        # GET: Read all rows, translate to dicts, send over as a JSON array list
        tasks = Todo.query.order_by(Todo.date_created).all()
        return jsonify([task.to_json() for task in tasks])

@app.route('/api/tasks/<int:id>', methods=['PUT', 'DELETE'])
def modify_task(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'PUT':
        data = request.json
        task.content = data.get('content', task.content)
        try:
            db.session.commit()
            return jsonify(task.to_json())
        except:
            return jsonify({"error": "Could not update task"}), 500

    elif request.method == 'DELETE':
        try:
            db.session.delete(task)
            db.session.commit()
            return jsonify({"success": True, "message": "Task deleted successfully"})
        except:
            return jsonify({"error": "Could not delete task"}), 500

if __name__ == "__main__":
    # Create tables automatically inside app context if they don't exist
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)