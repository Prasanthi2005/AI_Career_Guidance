# ==========================================
# AI Career Guidance & Placement Platform
# routes/jobs.py
# ==========================================

from flask import Blueprint, request, jsonify

# Blueprint
jobs_bp = Blueprint("jobs", __name__)

# ------------------------------------------
# Get All Jobs
# ------------------------------------------
@jobs_bp.route("/", methods=["GET"])
def get_jobs():

    jobs = [

        {
            "id": 1,
            "job_title": "AI Engineer",
            "company": "ABC Technologies",
            "location": "Hyderabad",
            "experience": "Fresher",
            "skills": [
                "Python",
                "Machine Learning",
                "SQL"
            ]
        },

        {
            "id": 2,
            "job_title": "Data Analyst",
            "company": "Infosys",
            "location": "Bangalore",
            "experience": "Fresher",
            "skills": [
                "Python",
                "Excel",
                "Power BI"
            ]
        },

        {
            "id": 3,
            "job_title": "Full Stack Developer",
            "company": "TCS",
            "location": "Chennai",
            "experience": "0-1 Years",
            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "Python"
            ]
        }

    ]

    return jsonify(jobs)


# ------------------------------------------
# Get Job By ID
# ------------------------------------------
@jobs_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):

    return jsonify({

        "id": job_id,
        "job_title": "AI Engineer",
        "company": "ABC Technologies",
        "location": "Hyderabad",
        "salary": "8 LPA",
        "experience": "Fresher"

    })


# ------------------------------------------
# Search Jobs
# ------------------------------------------
@jobs_bp.route("/search", methods=["GET"])
def search_jobs():

    keyword = request.args.get("keyword")

    return jsonify({

        "message": f"Search Results for '{keyword}'"

    })


# ------------------------------------------
# Apply Job
# ------------------------------------------
@jobs_bp.route("/apply", methods=["POST"])
def apply_job():

    data = request.get_json()

    student_id = data.get("student_id")
    job_id = data.get("job_id")

    if not student_id or not job_id:

        return jsonify({

            "success": False,
            "message": "Student ID and Job ID are required."

        }), 400

    return jsonify({

        "success": True,
        "message": "Job Application Submitted Successfully."

    })


# ------------------------------------------
# Recommended Jobs
# ------------------------------------------
@jobs_bp.route("/recommended", methods=["GET"])
def recommended_jobs():

    return jsonify({

        "recommended_jobs": [

            "AI Engineer",
            "Machine Learning Engineer",
            "Data Scientist",
            "Python Developer",
            "Data Analyst"

        ]

    })


# ------------------------------------------
# Saved Jobs
# ------------------------------------------
@jobs_bp.route("/saved", methods=["GET"])
def saved_jobs():

    return jsonify({

        "saved_jobs": [

            "AI Engineer",
            "Python Developer"

        ]

    })


# ------------------------------------------
# Delete Saved Job
# ------------------------------------------
@jobs_bp.route("/saved/<int:id>", methods=["DELETE"])
def delete_saved_job(id):

    return jsonify({

        "success": True,
        "message": f"Saved Job {id} Removed Successfully."

    })