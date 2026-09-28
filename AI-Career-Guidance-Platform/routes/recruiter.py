# ==========================================
# AI Career Guidance & Placement Platform
# routes/recruiter.py
# ==========================================

from flask import Blueprint, request, jsonify

# Create Blueprint
recruiter_bp = Blueprint("recruiter", __name__)

# ------------------------------------------
# Recruiter Dashboard
# ------------------------------------------
@recruiter_bp.route("/dashboard", methods=["GET"])
def dashboard():

    return jsonify({
        "success": True,
        "total_jobs": 5,
        "total_applicants": 120,
        "shortlisted": 25,
        "selected": 10
    })


# ------------------------------------------
# Post a New Job
# ------------------------------------------
@recruiter_bp.route("/post-job", methods=["POST"])
def post_job():

    data = request.get_json()

    job_title = data.get("job_title")
    company = data.get("company")
    location = data.get("location")
    skills = data.get("skills")

    if not job_title or not company:
        return jsonify({
            "success": False,
            "message": "Job Title and Company are required."
        }), 400

    return jsonify({
        "success": True,
        "message": "Job Posted Successfully",
        "job": {
            "job_title": job_title,
            "company": company,
            "location": location,
            "skills": skills
        }
    }), 201


# ------------------------------------------
# View All Jobs
# ------------------------------------------
@recruiter_bp.route("/jobs", methods=["GET"])
def get_jobs():

    jobs = [
        {
            "id": 1,
            "job_title": "AI Engineer",
            "company": "ABC Technologies",
            "location": "Hyderabad"
        },
        {
            "id": 2,
            "job_title": "Data Analyst",
            "company": "Infosys",
            "location": "Bangalore"
        }
    ]

    return jsonify(jobs)


# ------------------------------------------
# View Applicants
# ------------------------------------------
@recruiter_bp.route("/applicants", methods=["GET"])
def applicants():

    applicants = [
        {
            "id": 1,
            "name": "Bhavani",
            "email": "student@gmail.com",
            "resume_score": 90
        },
        {
            "id": 2,
            "name": "Rahul",
            "email": "rahul@gmail.com",
            "resume_score": 85
        }
    ]

    return jsonify(applicants)


# ------------------------------------------
# Shortlist Candidate
# ------------------------------------------
@recruiter_bp.route("/shortlist/<int:id>", methods=["PUT"])
def shortlist(id):

    return jsonify({
        "success": True,
        "message": f"Candidate {id} shortlisted successfully."
    })


# ------------------------------------------
# Delete Job
# ------------------------------------------
@recruiter_bp.route("/delete-job/<int:id>", methods=["DELETE"])
def delete_job(id):

    return jsonify({
        "success": True,
        "message": f"Job {id} deleted successfully."
    })