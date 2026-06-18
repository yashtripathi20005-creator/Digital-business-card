from flask import Flask, render_template, jsonify, request
import os
from datetime import datetime

app = Flask(__name__)

# Business card data
BUSINESS_CARD = {
    "name": "Alexandra Chen",
    "title": "Full Stack Developer & UI/UX Designer",
    "company": "TechVista Solutions",
    "email": "alexandra@techvista.com",
    "phone": "+1 (555) 234-5678",
    "website": "https://alexandrachen.dev",
    "location": "San Francisco, CA",
    "bio": "Passionate about creating beautiful, functional digital experiences. 8+ years of experience in web development and design.",
    "social": {
        "github": "https://github.com/alexandrachen",
        "linkedin": "https://linkedin.com/in/alexandrachen",
        "twitter": "https://twitter.com/alexandrachen",
        "instagram": "https://instagram.com/alexandrachen"
    },
    "skills": ["Python", "JavaScript", "React", "Flask", "Django", "Figma"],
    "languages": ["English (Native)", "Spanish (Fluent)", "Mandarin (Conversational)"],
    "hours": "Mon-Fri 9:00 AM - 6:00 PM PST",
    "timezone": "PST (UTC-8)"
}

@app.route('/')
def index():
    """Render the main digital business card page."""
    return render_template('index.html', card=BUSINESS_CARD)

@app.route('/api/card')
def get_card_data():
    """API endpoint to get business card data in JSON format."""
    return jsonify(BUSINESS_CARD)

@app.route('/api/card/contact', methods=['POST'])
def save_contact():
    """Endpoint to save contact information (for contact form)."""
    data = request.json
    # In a real app, you'd save this to a database
    # For demo, we'll just log it
    print(f"New contact request from: {data.get('name')} - {data.get('email')}")
    return jsonify({"status": "success", "message": "Message sent successfully!"})

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
