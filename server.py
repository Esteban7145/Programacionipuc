from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html', now=datetime.now())


@app.route('/health')
def health():
    return jsonify({"status": "ok", "time": datetime.now().isoformat()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
