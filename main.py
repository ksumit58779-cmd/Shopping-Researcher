from flask import Flask, render_template, jsonify, request
from app import search_product


app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query").strip()

    if not query:
        return jsonify({"error": "Please enter a search query!"}), 400
 
    try:
        result = search_product(query)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
 
if __name__ == "__main__":
    app.run(debug=True)