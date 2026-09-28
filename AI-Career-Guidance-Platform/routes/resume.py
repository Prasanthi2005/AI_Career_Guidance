# ==========================================
# AI Career Guidance & Placement Platform
# routes/resume.py
# ==========================================

import os

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

resume_bp = Blueprint("resume", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ------------------------------------------
# Check File Extension
# ------------------------------------------
def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ------------------------------------------
# Upload Resume
# ------------------------------------------
@resume_bp.route("/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({
            "success": False,
            "message": "No file selected."
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "Please choose a file."
        }), 400

    if file and allowed_file(file.filename):

        filename = secure_filename(file.filename)

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        file.save(filepath)

        return jsonify({
            "success": True,
            "message": "Resume uploaded successfully.",
            "file_name": filename
        })

    return jsonify({
        "success": False,
        "message": "Only PDF, DOC and DOCX files are allowed."
    }), 400


# ------------------------------------------
# AI Resume Analysis
# ------------------------------------------
@resume_bp.route("/analyze", methods=["GET"])
def analyze_resume():

    return jsonify({

        "resume_score": 90,

        "skills": [
            "Python",
            "Machine Learning",
            "HTML",
            "CSS",
            "JavaScript",
            "MySQL"
        ],

        "missing_skills": [
            "Docker",
            "AWS",
            "GitHub Actions"
        ],

        "recommendations": [
            "Add internship experience.",
            "Include GitHub project links.",
            "Mention project achievements.",
            "Add certifications."
        ]

    })


# ------------------------------------------
# Resume Score
# ------------------------------------------
@resume_bp.route("/score", methods=["GET"])
def resume_score():

    return jsonify({

        "resume_score": 90

    })


# ------------------------------------------
# Extract Skills
# ------------------------------------------
@resume_bp.route("/skills", methods=["GET"])
def extract_skills():

    return jsonify({

        "skills": [

            "Python",
            "Machine Learning",
            "HTML",
            "CSS",
            "JavaScript",
            "MySQL"

        ]

    })


# ------------------------------------------
# Skill Gap Analysis
# ------------------------------------------
@resume_bp.route("/skill-gap", methods=["GET"])
def skill_gap():

    return jsonify({

        "missing_skills": [

            "Docker",
            "TensorFlow",
            "AWS",
            "Git"

        ]

    })