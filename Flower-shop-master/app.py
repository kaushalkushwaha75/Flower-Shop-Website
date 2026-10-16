"""
🌸 Happy Petals - Premium Flower Shop & Floral Boutique Web Application
Python Flask Server
"""

import os
import sys
from flask import Flask, send_from_directory, jsonify

# Initialize Flask app serving static files from current directory
app = Flask(__name__, static_folder=".", static_url_path="")


@app.route("/")
def index():
    """Serve the main storefront landing page."""
    return send_from_directory(".", "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Serve static HTML pages, CSS, JS, and image assets."""
    if os.path.exists(filename):
        return send_from_directory(".", filename)
    return send_from_directory(".", "index.html"), 404


@app.route("/api/status", methods=["GET"])
def server_status():
    """Health and status check endpoint."""
    return jsonify({
        "status": "online",
        "name": "Happy Petals Flower Shop",
        "version": "1.0.0",
        "environment": "development" if app.debug else "production"
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("\n" + "=" * 60)
    print("🌸 Happy Petals Flower Shop Server is running!")
    print(f"👉 Local URL:   http://localhost:{port}")
    print(f"👉 Network URL: http://127.0.0.1:{port}")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=True)
