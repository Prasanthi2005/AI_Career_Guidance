# ==========================================
# AI Career Guidance & Placement Platform
# routes/student.py
# ==========================================

from flask import Blueprint, request, jsonify

# Create Blueprint
student_bp = Blueprint("student", __name__)

# ------------------------------------------
# Student Dashboard
# ------------------------------------------
@student_bp.route("/dashboard", methods=["GET"])
def dashboard():

    return jsonify({
        "success": True,
        "student": {
            "name": "Bhavani",
            "resume_score": 88,
            "placement_probability": 92,
            "skills_completed": 12,
            "jobs_applied": 8
        }
    })


# ------------------------------------------
# Student Profile
# ------------------------------------------
@student_bp.route("/profile", methods=["GET"])
def get_profile():

    profile = {
        "full_name": "Bhavani",
        "email": "student@gmail.com",
        "phone": "9876543210",
        "college": "KIETW",
        "branch": "CSE (AI)",
        "cgpa": 8.9,
        "skills": [
            "Python",
            "Machine Learning",
            "HTML",
            "CSS",
            "JavaScript",
            "MySQL"
        ]
    }

    return jsonify(profile)


# ------------------------------------------
# Update Profile
# ------------------------------------------
@student_bp.route("/profile", methods=["PUT"])
def update_profile():

    data = request.get_json()

    return jsonify({
        "success": True,
        "message": "Profile Updated Successfully",
        "updated_data": data
    })


# ------------------------------------------
# Placement Prediction
# ------------------------------------------
@student_bp.route("/placement", methods=["GET"])
def placement_prediction():

    return jsonify({
        "placement_probability": "92%",
        "recommendation":
        "Improve DSA and Aptitude for better opportunities."
    })


# ------------------------------------------
# Skill Gap Analysis
# ------------------------------------------
@student_bp.route("/skill-gap", methods=["GET"])
def skill_gap():

    return jsonify({
        "available_skills": [
            "Python",
            "HTML",
            "CSS",
            "JavaScript"
        ],

        "missing_skills": [
            "Docker",
            "AWS",
            "TensorFlow",
            "GitHub Actions"
        ]
    })


# ------------------------------------------
# Career Recommendation
# ------------------------------------------
@student_bp.route("/career", methods=["GET"])
def career_recommendation():

    return jsonify({

        "recommended_roles": [

            "AI Engineer",
            "Machine Learning Engineer",
            "Data Scientist",
            "Full Stack Developer",
            "Data Analyst"

        ]

    })


# ------------------------------------------
# Student Statistics
# ------------------------------------------
@student_bp.route("/statistics", methods=["GET"])
def statistics():

    return jsonify({

        "resume_score": 88,
        "interview_score": 91,
        "placement_probability": 92,
        "jobs_applied": 8,
        "courses_completed": 15

    })