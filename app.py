from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/manifest.json')
def manifest():
    return send_file('manifest.json')

@app.route('/service-worker.js')
def sw():
    return send_file('service-worker.js')

@app.route('/main.js')
def js():
    return send_file('main.js')

@app.route('/<path:filename>')  # pour les images ou icônes
def static_files(filename):
    return send_file(filename)

if __name__ == '__main__':
    app.run(debug=True)
