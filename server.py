from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html', now=datetime.now())




@app.route('/update/latest.json')
def update_latest():
    return jsonify({
        "version": "1.1.0",
        "url": "http://127.0.0.1:8000/downloads/MotoParkPro.exe",
        "notes": "Configura esta URL con tu ejecutable publicado"
    })


@app.route('/health')
def health():
    return jsonify({"status": "ok", "time": datetime.now().isoformat()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
