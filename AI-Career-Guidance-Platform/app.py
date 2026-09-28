from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash

import os
import random
import smtplib
import re
import time
import requests
import uuid
import json
import mysql.connector
from dotenv import load_dotenv
from google import genai
from google.genai import types
import mysql.connector
from mysql.connector import Error
from database.db import db, cursor
import uuid
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash,
    jsonify,
    send_file
)

from werkzeug.utils import secure_filename
# Import Routes
from routes.auth import auth_bp
from routes.student import student_bp
from routes.jobs import jobs_bp
from routes.resume import resume_bp
from routes.interview import interview_bp

from email.mime.text import MIMEText
from authlib.integrations.flask_client import OAuth
from werkzeug.utils import secure_filename
from pypdf import PdfReader
from database.db import db, cursor



# ==========================================
# GEMINI AI CONFIGURATION
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

gemini_client = genai.Client(
    api_key=GEMINI_API_KEY
)

app = Flask(__name__)
# Load configuration from config.py
app.config.from_object("config.Config")


app.secret_key = os.getenv("SECRET_KEY")

app.config["UPLOAD_FOLDER"] = os.path.join(
    app.root_path,
    "static",
    "uploads"
)

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

app.config.from_object("config.Config")
# Secret Key
app.config["SECRET_KEY"] = "AI_CAREER_PLATFORM"
oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=app.config["GOOGLE_CLIENT_ID"],
    client_secret=app.config["GOOGLE_CLIENT_SECRET"],
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(student_bp, url_prefix="/student")
app.register_blueprint(jobs_bp, url_prefix="/jobs")
app.register_blueprint(resume_bp, url_prefix="/resume")
app.register_blueprint(interview_bp, url_prefix="/interview")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        print("Register button clicked")

        fullname = request.form["fullname"]
        email = request.form["email"]
        phone = request.form["phone"]
        college = request.form["college"]
        branch = request.form["branch"]
        cgpa = request.form["cgpa"]
        password = request.form["password"]

        print(fullname, email)

        # ==============================
        # CHECK EMAIL ALREADY EXISTS
        # ==============================

        check_sql = "SELECT id FROM users WHERE email = %s"
        cursor.execute(check_sql, (email,))

        existing_user = cursor.fetchone()

        if existing_user:
            print("Email already registered")

            return render_template(
                "register.html",
                error="Email already registered. Please login."
            )

        # ==============================
        # INSERT NEW USER
        # ==============================

        sql = """
        INSERT INTO users
        (fullname, email, phone, college, branch, cgpa, password)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            fullname,
            email,
            phone,
            college,
            branch,
            cgpa,
            password
        )

        cursor.execute(sql, values)
        db.commit()

        print("Data Saved Successfully")

        return redirect(url_for("login"))

    return render_template("register.html")
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        sql = "SELECT * FROM users WHERE email=%s AND password=%s"
        values = (email, password)

        cursor.execute(sql, values)

        user = cursor.fetchone()

        if user:
          session["fullname"] = user[1]   # fullname
          session["email"] = user[2]      # email (user[2] నిజంగా email column అయితే)
          return redirect(url_for("dashboard"))
        else:
            return """
            <script>
            alert("Invalid Email or Password");
            window.location="/login";
            </script>
            """

    return render_template(
    "login.html",
    email=session.get("email", "")
)
@app.route("/dashboard")
def dashboard():

    # Logged-in student's email
    email = session.get("email")

    if not email:
        return redirect(url_for("login"))

    # Get this student's data from database
    cursor.execute("""
        SELECT
            fullname,
            skills,
            resume_score,
            placement_chance,
            jobs_applied
        FROM users
        WHERE email = %s
    """, (email,))

    user = cursor.fetchone()

    if not user:
        return redirect(url_for("login"))

    # Student name
    fullname = user[0]

    # Skills
    skills_text = user[1] or ""

    skills_count = len([
        skill.strip()
        for skill in skills_text.replace("\n", ",").split(",")
        if skill.strip()
    ])

    # Actual saved values
    resume_score = user[2] or 0
    placement_chance = user[3] or 0
    jobs_applied = user[4] or 0

    return render_template(
        "dashboard.html",
        fullname=fullname,
        resume_score=resume_score,
        placement_chance=placement_chance,
        skills_count=skills_count,
        jobs_applied=jobs_applied
    )







@app.route("/resume", methods=["GET", "POST"])
def resume():

    result = None
    success = None
    error = None

    # =========================================================
    # CHECK LOGIN
    # =========================================================

    email = session.get("email")

    if not email:
        return redirect(url_for("login"))

    fullname = session.get("fullname", "Student")

    print("\n====================================")
    print("RESUME PAGE")
    print("User:", fullname)
    print("Email:", email)
    print("====================================\n")

    # =========================================================
    # GET EXISTING RESUME + PREVIOUS ANALYSIS
    # =========================================================

    try:

        cursor.execute(
            """
            SELECT
                resume_file,
                resume_score,
                placement_chance,
                resume_analysis
            FROM users
            WHERE email=%s
            LIMIT 1
            """,
            (email,)
        )

        row = cursor.fetchone()

    except Exception as e:

        print("DATABASE ERROR WHILE LOADING RESUME:", e)

        row = None

        error = "Unable to load your previous resume information."

    existing_resume = None

    # =========================================================
    # RESTORE PREVIOUS DATA
    # =========================================================

    if row:

        existing_resume = row[0]

        # -----------------------------------------------------
        # Restore previous JSON analysis
        # -----------------------------------------------------

        if row[3]:

            try:

                result = json.loads(row[3])

                if not isinstance(result, dict):
                    result = None

            except Exception as e:

                print("Could not restore resume analysis:", e)

                result = None

    # =========================================================
    # SAFETY DEFAULTS FOR OLD DATABASE DATA
    # =========================================================

    if result:

        result.setdefault("score", row[1] if row and row[1] else 0)

        result.setdefault(
            "placement_chance",
            row[2] if row and row[2] else 0
        )

        result.setdefault("resume_status", "Resume Analyzed")

        result.setdefault("skill_score", 0)

        result.setdefault("structure_score", 0)

        result.setdefault("detected_skills", [])

        result.setdefault("missing_skills", [])

        result.setdefault(
            "sections",
            {
                "summary": False,
                "education": False,
                "skills": False,
                "projects": False,
                "experience": False,
                "internship": False,
                "certifications": False,
                "achievements": False
            }
        )

        result.setdefault("email_found", False)

        result.setdefault("phone_found", False)

        result.setdefault("github_found", False)

        result.setdefault("linkedin_found", False)

        result.setdefault("strengths", [])

        result.setdefault("improvements", [])

        result.setdefault("suggestions", [])

    # =========================================================
    # POST - UPLOAD RESUME
    # =========================================================

    if request.method == "POST":

        file = request.files.get("resume")

        # =====================================================
        # CHECK FILE
        # =====================================================

        if not file or not file.filename:

            error = "Please upload your resume PDF."

            return render_template(
                "resume.html",
                fullname=fullname,
                result=result,
                success=None,
                error=error,
                existing_resume=existing_resume
            )

        original_filename = secure_filename(file.filename)

        if not original_filename:

            error = "Invalid file name."

            return render_template(
                "resume.html",
                fullname=fullname,
                result=result,
                success=None,
                error=error,
                existing_resume=existing_resume
            )

        # =====================================================
        # PDF ONLY
        # =====================================================

        if not original_filename.lower().endswith(".pdf"):

            error = "Only PDF resume files are allowed."

            return render_template(
                "resume.html",
                fullname=fullname,
                result=result,
                success=None,
                error=error,
                existing_resume=existing_resume
            )

        save_path = None

        try:

            # =================================================
            # CREATE UNIQUE FILE NAME
            # =================================================

            unique_filename = (
                str(uuid.uuid4())
                + "_"
                + original_filename
            )

            upload_folder = app.config.get(
                "UPLOAD_FOLDER",
                os.path.join(
                    os.getcwd(),
                    "uploads"
                )
            )

            os.makedirs(
                upload_folder,
                exist_ok=True
            )

            save_path = os.path.join(
                upload_folder,
                unique_filename
            )

            # =================================================
            # SAVE PDF
            # =================================================

            file.save(save_path)

            print("\n====================================")
            print("RESUME FILE SAVED")
            print("Filename:", unique_filename)
            print("Path:", save_path)
            print("====================================\n")

            # =================================================
            # READ PDF
            # =================================================

            reader = PdfReader(save_path)

            resume_text_parts = []

            for page in reader.pages:

                try:

                    page_text = page.extract_text()

                    if page_text:

                        resume_text_parts.append(
                            page_text
                        )

                except Exception as page_error:

                    print(
                        "PDF PAGE READ ERROR:",
                        page_error
                    )

            resume_text = "\n".join(
                resume_text_parts
            )

            resume_text = re.sub(
                r"\s+",
                " ",
                resume_text
            ).strip()

            resume_text_lower = resume_text.lower()

            print(
                "Extracted resume characters:",
                len(resume_text)
            )

            # =================================================
            # EMPTY / SCANNED PDF CHECK
            # =================================================

            if len(resume_text) < 80:

                if save_path and os.path.exists(save_path):

                    os.remove(save_path)

                error = (
                    "Unable to read text from this PDF. "
                    "Please upload a text-based resume PDF. "
                    "Scanned/image-only PDFs may not be readable."
                )

                return render_template(
                    "resume.html",
                    fullname=fullname,
                    result=result,
                    success=None,
                    error=error,
                    existing_resume=existing_resume
                )

            # =================================================
            # RESUME KEYWORDS
            # =================================================

            resume_keywords = [

                "resume",
                "curriculum vitae",
                "career objective",
                "objective",
                "professional summary",
                "summary",
                "education",
                "academic",
                "skills",
                "technical skills",
                "experience",
                "work experience",
                "internship",
                "intern",
                "projects",
                "project",
                "certifications",
                "certification",
                "achievements",
                "achievement",
                "contact"

            ]

            matched_keywords = []

            for keyword in resume_keywords:

                if keyword in resume_text_lower:

                    matched_keywords.append(keyword)

            # =================================================
            # EMAIL DETECTION
            # =================================================

            email_found = bool(
                re.search(
                    r"[A-Za-z0-9._%+-]+"
                    r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
                    resume_text
                )
            )

            # =================================================
            # PHONE DETECTION
            # =================================================

            phone_found = bool(
                re.search(
                    r"(?:\+91[\s-]?)?[6-9]\d{9}",
                    resume_text
                )
            )

            # =================================================
            # GITHUB
            # =================================================

            github_found = bool(
                re.search(
                    r"github\.com",
                    resume_text_lower
                )
                or
                re.search(
                    r"\bgithub\b",
                    resume_text_lower
                )
            )

            # =================================================
            # LINKEDIN
            # =================================================

            linkedin_found = bool(
                re.search(
                    r"linkedin\.com",
                    resume_text_lower
                )
                or
                re.search(
                    r"\blinkedin\b",
                    resume_text_lower
                )
            )

            # =================================================
            # BASIC RESUME VALIDATION
            # =================================================

            if (
                len(matched_keywords) < 3
                or not email_found
                or not phone_found
            ):

                if save_path and os.path.exists(save_path):

                    os.remove(save_path)

                error = (
                    "The uploaded PDF does not appear to be "
                    "a valid resume. Please make sure your resume "
                    "contains sections such as Education, Skills, "
                    "Projects or Experience and includes your "
                    "email and phone number."
                )

                return render_template(
                    "resume.html",
                    fullname=fullname,
                    result=result,
                    success=None,
                    error=error,
                    existing_resume=existing_resume
                )

            # =================================================
            # SKILLS TO DETECT
            # =================================================

            skills_patterns = {

                "python": r"\bpython\b",

                "java": r"\bjava\b",

                "c": r"(?<![a-z])c(?![a-z+#])",

                "c++": r"\bc\+\+\b",

                "html": r"\bhtml5?\b",

                "css": r"\bcss3?\b",

                "javascript": r"\bjavascript\b|\bjs\b",

                "react": r"\breact(?:\.js)?\b",

                "node.js": r"\bnode(?:\.js)?\b",

                "flask": r"\bflask\b",

                "django": r"\bdjango\b",

                "mysql": r"\bmysql\b",

                "mongodb": r"\bmongodb\b",

                "machine learning": r"\bmachine learning\b",

                "deep learning": r"\bdeep learning\b",

                "artificial intelligence":
                    r"\bartificial intelligence\b|\bai\b",

                "data science": r"\bdata science\b",

                "pandas": r"\bpandas\b",

                "numpy": r"\bnumpy\b",

                "scikit-learn":
                    r"\bscikit[- ]learn\b",

                "tensorflow": r"\btensorflow\b",

                "pytorch": r"\bpytorch\b",

                "git": r"\bgit\b",

                "github": r"\bgithub\b",

                "docker": r"\bdocker\b",

                "aws": r"\baws\b",

                "azure": r"\bazure\b",

                "power bi": r"\bpower bi\b",

                "sql": r"\bsql\b"

            }

            # =================================================
            # DETECT SKILLS
            # =================================================

            detected_skills = []

            for skill, pattern in skills_patterns.items():

                try:

                    if re.search(
                        pattern,
                        resume_text_lower
                    ):

                        detected_skills.append(skill)

                except Exception:

                    pass

            # =================================================
            # REQUIRED SKILLS
            # =================================================

            required_skills = [

                "python",
                "java",
                "sql",
                "html",
                "css",
                "javascript",
                "git",
                "github",
                "mysql",
                "machine learning"

            ]

            # =================================================
            # MISSING SKILLS
            # =================================================

            missing_skills = []

            for skill in required_skills:

                if skill not in detected_skills:

                    missing_skills.append(skill)

            # =================================================
            # SECTION DETECTION
            # =================================================

            sections = {

                "summary": (
                    "summary" in resume_text_lower
                    or
                    "professional summary"
                    in resume_text_lower
                    or
                    "objective"
                    in resume_text_lower
                ),

                "education": (
                    "education"
                    in resume_text_lower
                    or
                    "academic"
                    in resume_text_lower
                ),

                "skills": (
                    "skills"
                    in resume_text_lower
                    or
                    "technical skills"
                    in resume_text_lower
                ),

                "projects": (
                    "projects"
                    in resume_text_lower
                    or
                    "project"
                    in resume_text_lower
                ),

                "experience": (
                    "experience"
                    in resume_text_lower
                    or
                    "work experience"
                    in resume_text_lower
                ),

                "internship": (
                    "internship"
                    in resume_text_lower
                    or
                    "intern"
                    in resume_text_lower
                ),

                "certifications": (
                    "certifications"
                    in resume_text_lower
                    or
                    "certification"
                    in resume_text_lower
                ),

                "achievements": (
                    "achievements"
                    in resume_text_lower
                    or
                    "achievement"
                    in resume_text_lower
                )

            }

            # =================================================
            # SKILL SCORE
            # =================================================

            if len(required_skills) > 0:

                skill_score = int(
                    (
                        len(
                            [
                                skill
                                for skill in required_skills
                                if skill in detected_skills
                            ]
                        )
                        /
                        len(required_skills)
                    )
                    * 100
                )

            else:

                skill_score = 0

            skill_score = max(
                0,
                min(skill_score, 100)
            )

            # =================================================
            # STRUCTURE SCORE
            # =================================================

            section_count = sum(
                1
                for value in sections.values()
                if value
            )

            structure_score = int(
                (
                    section_count
                    /
                    len(sections)
                )
                * 100
            )

            structure_score = max(
                0,
                min(structure_score, 100)
            )

            # =================================================
            # CONTACT SCORE
            # =================================================

            contact_score = 0

            if email_found:

                contact_score += 50

            if phone_found:

                contact_score += 50

            # =================================================
            # PROFESSIONAL LINKS SCORE
            # =================================================

            profile_score = 0

            if github_found:

                profile_score += 50

            if linkedin_found:

                profile_score += 50

            # =================================================
            # FINAL RESUME SCORE
            # =================================================

            score = int(
                (
                    skill_score * 0.40
                    +
                    structure_score * 0.35
                    +
                    contact_score * 0.15
                    +
                    profile_score * 0.10
                )
            )

            score = max(
                0,
                min(score, 100)
            )

            # =================================================
            # RESUME STATUS
            # =================================================

            if score >= 85:

                resume_status = "Excellent Resume"

            elif score >= 70:

                resume_status = "Good Resume"

            elif score >= 50:

                resume_status = "Average Resume"

            else:

                resume_status = "Weak Resume"

            # =================================================
            # PLACEMENT READINESS
            # =================================================

            placement_chance = int(
                (
                    skill_score * 0.45
                    +
                    structure_score * 0.25
                    +
                    contact_score * 0.15
                    +
                    profile_score * 0.15
                )
            )

            placement_chance = max(
                0,
                min(
                    placement_chance,
                    100
                )
            )

            # =================================================
            # STRENGTHS
            # =================================================

            strengths = []

            if skill_score >= 80:

                strengths.append(
                    "Strong technical skill coverage "
                    "was detected."
                )

            elif skill_score >= 60:

                strengths.append(
                    "Your resume contains a good number "
                    "of technical skills."
                )

            elif skill_score >= 40:

                strengths.append(
                    "Some relevant technical skills "
                    "are present."
                )

            if sections.get("education"):

                strengths.append(
                    "Education section is present."
                )

            if sections.get("projects"):

                strengths.append(
                    "Projects section is present."
                )

            if sections.get("experience"):

                strengths.append(
                    "Experience section is included."
                )

            if sections.get("internship"):

                strengths.append(
                    "Internship or practical experience "
                    "is mentioned."
                )

            if sections.get("certifications"):

                strengths.append(
                    "Certifications are included."
                )

            if email_found and phone_found:

                strengths.append(
                    "Both email and phone contact "
                    "information were detected."
                )

            if github_found:

                strengths.append(
                    "GitHub profile information was detected."
                )

            if linkedin_found:

                strengths.append(
                    "LinkedIn profile information was detected."
                )

            if not strengths:

                strengths.append(
                    "Your resume has been successfully "
                    "processed and analyzed."
                )

            # =================================================
            # IMPROVEMENTS
            # =================================================

            improvements = []

            if missing_skills:

                improvements.append(
                    "Consider adding relevant missing "
                    "technical skills: "
                    + ", ".join(missing_skills[:5])
                    + "."
                )

            if not sections.get("summary"):

                improvements.append(
                    "Add a short professional summary "
                    "or career objective."
                )

            if not sections.get("projects"):

                improvements.append(
                    "Add academic or personal projects "
                    "with technologies and measurable results."
                )

            if not sections.get("experience"):

                improvements.append(
                    "Add internship or work experience "
                    "if applicable."
                )

            if not sections.get("certifications"):

                improvements.append(
                    "Add relevant technical certifications "
                    "if available."
                )

            if not github_found:

                improvements.append(
                    "Add your GitHub profile and project repositories."
                )

            if not linkedin_found:

                improvements.append(
                    "Add your LinkedIn profile."
                )

            if not sections.get("achievements"):

                improvements.append(
                    "Add achievements, awards or coding "
                    "platform accomplishments if available."
                )

            if not improvements:

                improvements.append(
                    "Your resume structure is strong. "
                    "Continue adding measurable achievements "
                    "and project impact."
                )

            # =================================================
            # CAREER SUGGESTIONS
            # =================================================

            suggestions = []

            detected = set(
                detected_skills
            )

            if (
                "python" in detected
                and
                "flask" in detected
            ):

                suggestions.append(
                    "Python / Flask Developer"
                )

            if (
                "python" in detected
                and
                (
                    "machine learning"
                    in detected
                    or
                    "scikit-learn"
                    in detected
                )
            ):

                suggestions.append(
                    "Python / Machine Learning Developer"
                )

            if (
                "javascript" in detected
                and
                "react" in detected
            ):

                suggestions.append(
                    "Frontend / React Developer"
                )

            if (
                "java" in detected
                and
                "sql" in detected
            ):

                suggestions.append(
                    "Java Backend Developer"
                )

            if (
                "html" in detected
                and
                "css" in detected
                and
                "javascript" in detected
            ):

                suggestions.append(
                    "Web Developer"
                )

            if (
                "sql" in detected
                or
                "mysql" in detected
            ):

                suggestions.append(
                    "Database / SQL Developer"
                )

            if (
                "data science" in detected
                or
                "pandas" in detected
                or
                "numpy" in detected
            ):

                suggestions.append(
                    "Data Science / Data Analyst"
                )

            # Remove duplicates
            suggestions = list(
                dict.fromkeys(suggestions)
            )

            if not suggestions:

                suggestions.append(
                    "Software Developer"
                )

                suggestions.append(
                    "Junior Web Developer"
                )

                suggestions.append(
                    "Graduate Software Engineer"
                )

            # =================================================
            # FINAL RESULT
            # =================================================

            result = {

                "score": int(score),

                "resume_status": resume_status,

                "placement_chance":
                    int(placement_chance),

                "skill_score":
                    int(skill_score),

                "structure_score":
                    int(structure_score),

                "detected_skills":
                    detected_skills,

                "missing_skills":
                    missing_skills,

                "sections":
                    sections,

                "email_found":
                    email_found,

                "phone_found":
                    phone_found,

                "github_found":
                    github_found,

                "linkedin_found":
                    linkedin_found,

                "strengths":
                    strengths,

                "improvements":
                    improvements,

                "suggestions":
                    suggestions

            }

            # =================================================
            # CONVERT TO JSON
            # =================================================

            analysis_json = json.dumps(
                result
            )

            # =================================================
            # SAVE ANALYSIS TO MYSQL
            # =================================================

            cursor.execute(
                """
                UPDATE users
                SET
                    resume_file=%s,
                    resume_score=%s,
                    placement_chance=%s,
                    resume_analysis=%s
                WHERE email=%s
                """,
                (
                    unique_filename,
                    int(score),
                    int(placement_chance),
                    analysis_json,
                    email
                )
            )

            db.commit()

            # =================================================
            # UPDATE SESSION
            # =================================================

            session["resume_uploaded"] = True

            session["resume_filename"] = (
                unique_filename
            )

            session["resume_score"] = int(score)

            session["placement_chance"] = int(
                placement_chance
            )

            session["detected_skills"] = (
                detected_skills
            )

            session["missing_skills"] = (
                missing_skills
            )

            session["resume_suggestions"] = (
                suggestions
            )

            # =================================================
            # CURRENT FILE
            # =================================================

            existing_resume = (
                unique_filename
            )

            success = (
                "Resume uploaded and analyzed successfully!"
            )

            print("\n====================================")
            print("RESUME ANALYSIS SUCCESS")
            print("Score:", score)
            print("Status:", resume_status)
            print(
                "Placement:",
                placement_chance
            )
            print(
                "Skill Score:",
                skill_score
            )
            print(
                "Structure Score:",
                structure_score
            )
            print(
                "Detected Skills:",
                detected_skills
            )
            print("====================================\n")

        # =====================================================
        # ERROR HANDLING
        # =====================================================

        except Exception as e:

            print("\n====================================")
            print("RESUME ERROR:")
            print(str(e))
            print("====================================\n")

            try:

                db.rollback()

            except Exception:

                pass

            # Delete newly uploaded file
            # if analysis failed

            if (
                save_path
                and
                os.path.exists(save_path)
            ):

                try:

                    os.remove(save_path)

                except Exception as remove_error:

                    print(
                        "Could not remove failed resume:",
                        remove_error
                    )

            error = (
                "Unable to analyze resume: "
                + str(e)
            )

    # =========================================================
    # RENDER RESUME PAGE
    # =========================================================

    return render_template(
        "resume.html",
        fullname=fullname,
        result=result,
        success=success,
        error=error,
        existing_resume=existing_resume
    )




@app.route("/resume-file/<filename>")
def resume_file(filename):

    email = session.get("email")

    if not email:
        return redirect(url_for("login"))

    try:

        cursor.execute(
            """
            SELECT resume_file
            FROM users
            WHERE email=%s
            LIMIT 1
            """,
            (email,)
        )

        row = cursor.fetchone()

        if not row:
            return "Resume not found.", 404

        stored_filename = row[0]

        if not stored_filename:
            return "No resume uploaded.", 404

        # Security: user can only access
        # their own stored resume
        if stored_filename != filename:
            return "Unauthorized.", 403

        upload_folder = app.config.get(
            "UPLOAD_FOLDER",
            os.path.join(
                os.getcwd(),
                "uploads"
            )
        )

        file_path = os.path.join(
            upload_folder,
            stored_filename
        )

        if not os.path.exists(file_path):

            return "Resume file not found on server.", 404

        return send_file(
            file_path,
            mimetype="application/pdf",
            as_attachment=False
        )

    except Exception as e:

        print(
            "RESUME FILE ERROR:",
            e
        )

        return "Unable to open resume file.", 500

@app.route("/jobs")
def jobs():

    fullname = session.get("fullname", "")

    # =====================================================
    # TARGET CAREER
    # =====================================================

    target_career = session.get(
        "target_career",
        session.get(
            "recommended_career",
            "Software Developer"
        )
    )

    # =====================================================
    # RESUME SKILLS
    # =====================================================

    detected_skills = session.get(
        "detected_skills",
        []
    )

    # Make sure skills are a list
    if not isinstance(detected_skills, list):
        detected_skills = []

    # =====================================================
    # CAREER SEARCH QUERIES
    # =====================================================
    # IMPORTANT:
    # Do NOT use one long query.
    # Adzuna may return 0 results when too many
    # keywords are combined.
    # =====================================================

    career_queries = {

        "Frontend Developer": [
            "frontend developer",
            "front end developer",
            "frontend engineer",
            "javascript developer",
            "react developer"
        ],

        "Backend Developer": [
            "backend developer",
            "back end developer",
            "backend engineer",
            "python backend developer",
            "flask developer"
        ],

        "Python Developer": [
            "python developer",
            "python programmer",
            "python engineer",
            "django developer",
            "flask developer"
        ],

        "Python Full Stack Developer": [
            "python full stack developer",
            "full stack python developer",
            "python web developer",
            "full stack developer"
        ],

        "Full Stack Developer": [
            "full stack developer",
            "fullstack developer",
            "full stack engineer",
            "web developer"
        ],

        "AI / Machine Learning Engineer": [
            "machine learning engineer",
            "AI engineer",
            "artificial intelligence engineer",
            "ML engineer",
            "machine learning"
        ],

        "Data Scientist": [
            "data scientist",
            "data science",
            "machine learning scientist",
            "applied scientist"
        ],

        "Data Analyst": [
            "data analyst",
            "business data analyst",
            "data analytics",
            "reporting analyst"
        ],

        "Database / SQL Developer": [
            "SQL developer",
            "database developer",
            "database engineer",
            "SQL analyst"
        ],

        "Cloud Engineer": [
            "cloud engineer",
            "AWS engineer",
            "Azure engineer",
            "cloud developer",
            "DevOps engineer"
        ],

        "Software Developer": [
            "software developer",
            "software engineer",
            "application developer",
            "web developer",
            "python developer"
        ]
    }

    # =====================================================
    # GET SEARCH QUERIES
    # =====================================================

    search_queries = career_queries.get(
        target_career,
        [
            target_career,
            "software developer",
            "software engineer"
        ]
    )

    # =====================================================
    # USER FILTERS
    # =====================================================

    keyword = request.args.get(
        "keyword",
        ""
    ).strip()

    location = request.args.get(
        "location",
        ""
    ).strip()

    work_mode = request.args.get(
        "work_mode",
        ""
    ).strip()

    # If user manually searches something,
    # use that as the primary query.
    if keyword:

        search_queries = [
            keyword
        ]

    # =====================================================
    # DEFAULT VALUES
    # =====================================================

    jobs_list = []

    api_error = False

    api_message = ""

    # Used to avoid duplicate jobs
    seen_job_ids = set()

    # =====================================================
    # ADZUNA API
    # =====================================================

    try:

        app_id = app.config["ADZUNA_APP_ID"]

        app_key = app.config["ADZUNA_APP_KEY"]

        # =================================================
        # SEARCH MULTIPLE QUERIES
        # =================================================

        for search_query in search_queries:

            # Stop when we already have enough jobs
            if len(jobs_list) >= 30:
                break

            params = {

                "app_id": app_id,

                "app_key": app_key,

                "results_per_page": 20,

                "what": search_query,

                "content-type":
                    "application/json",

                "sort_by":
                    "date"

            }

            # Location is optional
            if location:

                params["where"] = location

            response = requests.get(

                "https://api.adzuna.com/v1/api/jobs/in/search/1",

                params=params,

                timeout=20

            )

            response.raise_for_status()

            data = response.json()

            raw_jobs = data.get(
                "results",
                []
            )

            print(
                "JOB SEARCH:",
                search_query,
                "->",
                len(raw_jobs),
                "jobs"
            )

            # =============================================
            # PROCESS JOBS
            # =============================================

            for job in raw_jobs:

                # =========================================
                # JOB ID
                # =========================================

                job_id = job.get("id")

                # Avoid duplicate jobs
                if job_id in seen_job_ids:
                    continue

                seen_job_ids.add(job_id)

                # =========================================
                # BASIC DETAILS
                # =========================================

                title = job.get(
                    "title",
                    "Job Opportunity"
                )

                company_data = job.get(
                    "company",
                    {}
                )

                company = company_data.get(
                    "display_name",
                    "Company"
                )

                location_data = job.get(
                    "location",
                    {}
                )

                location_name = location_data.get(
                    "display_name",
                    "India"
                )

                description = job.get(
                    "description",
                    ""
                )

                redirect_url = job.get(
                    "redirect_url",
                    "#"
                )

                # =========================================
                # SALARY
                # =========================================

                salary_min = job.get(
                    "salary_min"
                )

                salary_max = job.get(
                    "salary_max"
                )

                if salary_min and salary_max:

                    salary = (
                        f"₹{salary_min:,.0f} - "
                        f"₹{salary_max:,.0f}"
                    )

                elif salary_min:

                    salary = (
                        f"From ₹{salary_min:,.0f}"
                    )

                else:

                    salary = "Salary not disclosed"

                # =========================================
                # AI SKILL MATCHING
                # =========================================

                text = (

                    title +
                    " " +
                    description

                ).lower()

                matched = []

                missing = []

                for skill in detected_skills:

                    skill_lower = (
                        str(skill)
                        .lower()
                        .strip()
                    )

                    if not skill_lower:
                        continue

                    # Exact phrase match
                    if skill_lower in text:

                        matched.append(skill)

                    else:

                        missing.append(skill)

                # =========================================
                # MATCH PERCENTAGE
                # =========================================

                if detected_skills:

                    match_percentage = int(

                        (
                            len(matched) /
                            len(detected_skills)
                        ) * 100

                    )

                else:

                    # If resume has no detected skills,
                    # give a neutral starting score.
                    match_percentage = 50

                # Keep score between 35 and 98
                match_percentage = max(
                    35,
                    min(
                        match_percentage,
                        98
                    )
                )

                # =========================================
                # ADD JOB
                # =========================================

                jobs_list.append({

                    "id":
                        job_id,

                    "title":
                        title,

                    "company":
                        company,

                    "location":
                        location_name,

                    "salary":
                        salary,

                    "description":
                        description,

                    "url":
                        redirect_url,

                    "contract_type":
                        job.get(
                            "contract_type",
                            "Not specified"
                        ),

                    "contract_time":
                        job.get(
                            "contract_time",
                            "Not specified"
                        ),

                    "created":
                        job.get(
                            "created",
                            ""
                        ),

                    "match":
                        match_percentage,

                    "matched_skills":
                        matched,

                    "missing_skills":
                        missing

                })

                # Stop after 30 jobs
                if len(jobs_list) >= 30:
                    break

        # =================================================
        # SORT BY AI MATCH
        # =================================================

        jobs_list.sort(

            key=lambda x:
                x["match"],

            reverse=True

        )

    # =====================================================
    # TIMEOUT
    # =====================================================

    except requests.exceptions.Timeout:

        print(
            "JOB API ERROR: Request timed out"
        )

        api_error = True

        api_message = (
            "Job service is taking too long to respond."
        )

    # =====================================================
    # HTTP ERROR
    # =====================================================

    except requests.exceptions.HTTPError as e:

        print(
            "JOB API HTTP ERROR:",
            e
        )

        api_error = True

        api_message = (
            "Job service is temporarily unavailable."
        )

    # =====================================================
    # CONNECTION ERROR
    # =====================================================

    except requests.exceptions.ConnectionError as e:

        print(
            "JOB API CONNECTION ERROR:",
            e
        )

        api_error = True

        api_message = (
            "Unable to connect to the job service."
        )

    # =====================================================
    # OTHER ERROR
    # =====================================================

    except Exception as e:

        print(
            "JOB API ERROR:",
            e
        )

        api_error = True

        api_message = (
            "Unable to load live jobs right now."
        )

    # =====================================================
    # FINAL SEARCH QUERY FOR DISPLAY
    # =====================================================

    if keyword:

        display_search_query = keyword

    else:

        display_search_query = (
            search_queries[0]
            if search_queries
            else target_career
        )

    # =====================================================
    # RENDER PAGE
    # =====================================================

    return render_template(

        "jobs.html",

        fullname=fullname,

        target_career=target_career,

        detected_skills=detected_skills,

        jobs=jobs_list,

        total_jobs=len(jobs_list),

        search_query=display_search_query,

        location=location,

        work_mode=work_mode,

        api_error=api_error,

        api_message=api_message

    )


# =========================================================
# AI MOCK INTERVIEW
# =========================================================

@app.route("/interview")
def interview():

    fullname = session.get("fullname", "Student")

    # User previously selected target career
    target_career = session.get(
        "target_career",
        session.get(
            "recommended_career",
            "Frontend Developer"
        )
    )

    return render_template(
        "interview.html",
        fullname=fullname,
        target_career=target_career
    )


# =========================================================
# SAVE TARGET CAREER
# =========================================================

@app.route("/interview/set-career", methods=["POST"])
def set_interview_career():

    data = request.get_json()

    career = data.get(
        "career",
        "Frontend Developer"
    )

    session["target_career"] = career

    return jsonify({

        "success": True,

        "career": career

    })


# =========================================================
# AI INTERVIEW EVALUATION
# =========================================================

@app.route("/api/interview/evaluate", methods=["POST"])
def evaluate_interview():

    data = request.get_json()

    career = data.get(
        "career",
        "Frontend Developer"
    )

    answers = data.get(
        "answers",
        []
    )


    if not answers:

        return jsonify({

            "success": False,

            "message": "No answers received."

        }), 400


    # -----------------------------------------------------
    # BASIC ANSWER ANALYSIS
    # -----------------------------------------------------

    total_words = 0

    for item in answers:

        answer = item.get(
            "answer",
            ""
        )

        words = answer.split()

        total_words += len(words)


    average_words = (
        total_words / len(answers)
    )


    # -----------------------------------------------------
    # COMMUNICATION SCORE
    # -----------------------------------------------------

    if average_words >= 100:

        communication = 92

    elif average_words >= 70:

        communication = 85

    elif average_words >= 45:

        communication = 78

    elif average_words >= 25:

        communication = 68

    else:

        communication = 55


    # -----------------------------------------------------
    # RELEVANCE
    # -----------------------------------------------------

    relevance = 80


    # -----------------------------------------------------
    # TECHNICAL
    # -----------------------------------------------------

    technical_keywords = {

        "Frontend Developer": [
            "html",
            "css",
            "javascript",
            "react",
            "dom",
            "responsive"
        ],

        "Python Developer": [
            "python",
            "django",
            "flask",
            "oop",
            "list",
            "dictionary"
        ],

        "Backend Developer": [
            "api",
            "rest",
            "database",
            "authentication",
            "server"
        ],

        "Full Stack Developer": [
            "frontend",
            "backend",
            "api",
            "database",
            "javascript"
        ],

        "Data Scientist": [
            "machine learning",
            "python",
            "pandas",
            "numpy",
            "regression",
            "classification"
        ],

        "AI / Machine Learning Engineer": [
            "machine learning",
            "artificial intelligence",
            "model",
            "training",
            "classification",
            "regression"
        ]

    }


    keywords = technical_keywords.get(
        career,
        []
    )


    matched_keywords = 0


    for item in answers:

        answer = item.get(
                "answer",
                ""
            ).lower()

        for keyword in keywords:

            if keyword in answer:

                matched_keywords += 1


    if matched_keywords >= 6:

        technical = 94

    elif matched_keywords >= 4:

        technical = 86

    elif matched_keywords >= 2:

        technical = 76

    else:

        technical = 62


    # -----------------------------------------------------
    # CONFIDENCE
    # -----------------------------------------------------

    confidence = min(
        95,
        max(
            60,
            int(communication * 0.92)
        )
    )


    # -----------------------------------------------------
    # OVERALL
    # -----------------------------------------------------

    overall = round(
        (
            communication +
            technical +
            relevance +
            confidence
        ) / 4
    )


    # -----------------------------------------------------
    # READINESS
    # -----------------------------------------------------

    if overall >= 85:

        readiness = "INTERVIEW READY"

    elif overall >= 70:

        readiness = "ALMOST READY"

    else:

        readiness = "NEEDS PRACTICE"


    # -----------------------------------------------------
    # STRENGTHS
    # -----------------------------------------------------

    strengths = []


    if communication >= 80:

        strengths.append(
            "Good communication and answer structure."
        )

    if technical >= 80:

        strengths.append(
            "Strong understanding of technical concepts."
        )

    if confidence >= 80:

        strengths.append(
            "Good confidence during the interview."
        )

    if not strengths:

        strengths.append(
            "You completed the complete interview process."
        )


    # -----------------------------------------------------
    # IMPROVEMENTS
    # -----------------------------------------------------

    improvements = []


    if communication < 80:

        improvements.append(
            "Give longer and better structured answers."
        )

    if technical < 80:

        improvements.append(
            f"Improve your {career} technical concepts."
        )

    if relevance < 80:

        improvements.append(
            "Keep your answers more directly related to the question."
        )

    if not improvements:

        improvements.append(
            "Continue practising advanced interview questions."
        )


    # -----------------------------------------------------
    # SAVE RESULT IN SESSION
    # -----------------------------------------------------

    session["interview_score"] = overall

    session["interview_career"] = career

    session["interview_completed"] = True


    return jsonify({

        "success": True,

        "career": career,

        "overall": overall,

        "communication": communication,

        "technical": technical,

        "relevance": relevance,

        "confidence": confidence,

        "readiness": readiness,

        "strengths": strengths,

        "improvements": improvements

    })
# =========================================================
# PROFILE PAGE
# =========================================================
# =========================================================
# PROFILE PAGE
# =========================================================
@app.route("/profile")
def profile():

    email = session.get("email")

    if not email:
        return redirect(url_for("login"))

    try:

        cursor.execute(
            """
            SELECT
                id,
                fullname,
                email,
                phone,
                college,
                branch,
                cgpa,
                skills,
                projects,
                certifications,
                github,
                linkedin,
                profile_photo
            FROM users
            WHERE email = %s
            LIMIT 1
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:
            flash("Profile not found.", "error")
            return redirect(url_for("dashboard"))

        return render_template(
            "profile.html",
            user=user,
            fullname=user[1]
        )

    except Exception as e:

        print("PROFILE ERROR:", e)

        return f"Profile error: {e}", 500
# =========================================================
# SAVE PROFILE
# =========================================================
# =========================================================
# SAVE PROFILE
# =========================================================

@app.route("/save-profile", methods=["POST"])
def save_profile():

    email = session.get("email")

    if not email:
        flash("Please login first.", "error")
        return redirect(url_for("login"))

    try:

        # ==========================================
        # GET FORM DATA
        # ==========================================

        fullname = request.form.get("fullname", "").strip()
        phone = request.form.get("phone", "").strip()
        college = request.form.get("college", "").strip()
        branch = request.form.get("branch", "").strip()
        cgpa = request.form.get("cgpa", "").strip()

        skills = request.form.get("skills", "").strip()
        projects = request.form.get("projects", "").strip()
        certifications = request.form.get(
            "certifications", ""
        ).strip()

        github = request.form.get("github", "").strip()
        linkedin = request.form.get("linkedin", "").strip()

        # ==========================================
        # CGPA
        # ==========================================

        cgpa_value = None

        if cgpa:

            try:
                cgpa_value = float(cgpa)

            except ValueError:

                flash(
                    "Please enter a valid CGPA.",
                    "error"
                )

                return redirect(
                    url_for("profile")
                )

        # ==========================================
        # PHOTO
        # ==========================================

        photo = request.files.get("photo")

        profile_photo = None

        if photo and photo.filename:

            filename = secure_filename(
                photo.filename
            )

            allowed_extensions = {
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp"
            }

            if "." not in filename:

                flash(
                    "Invalid image file.",
                    "error"
                )

                return redirect(
                    url_for("profile")
                )

            extension = filename.rsplit(
                ".",
                1
            )[1].lower()

            if extension not in allowed_extensions:

                flash(
                    "Only JPG, JPEG, PNG, GIF and WEBP files are allowed.",
                    "error"
                )

                return redirect(
                    url_for("profile")
                )

            # Unique filename
            profile_photo = (
                str(uuid.uuid4())
                + "."
                + extension
            )

            # static/uploads
            upload_folder = os.path.join(
                app.static_folder,
                "uploads"
            )

            os.makedirs(
                upload_folder,
                exist_ok=True
            )

            photo_path = os.path.join(
                upload_folder,
                profile_photo
            )

            photo.save(photo_path)

            print(
                "PROFILE PHOTO SAVED:",
                photo_path
            )

        # ==========================================
        # UPDATE DATABASE
        # ==========================================

        if profile_photo:

            cursor.execute(
                """
                UPDATE users
                SET
                    fullname = %s,
                    phone = %s,
                    college = %s,
                    branch = %s,
                    cgpa = %s,
                    skills = %s,
                    projects = %s,
                    certifications = %s,
                    github = %s,
                    linkedin = %s,
                    profile_photo = %s
                WHERE email = %s
                """,
                (
                    fullname,
                    phone,
                    college,
                    branch,
                    cgpa_value,
                    skills,
                    projects,
                    certifications,
                    github,
                    linkedin,
                    profile_photo,
                    email
                )
            )

        else:

            cursor.execute(
                """
                UPDATE users
                SET
                    fullname = %s,
                    phone = %s,
                    college = %s,
                    branch = %s,
                    cgpa = %s,
                    skills = %s,
                    projects = %s,
                    certifications = %s,
                    github = %s,
                    linkedin = %s
                WHERE email = %s
                """,
                (
                    fullname,
                    phone,
                    college,
                    branch,
                    cgpa_value,
                    skills,
                    projects,
                    certifications,
                    github,
                    linkedin,
                    email
                )
            )

        # ==========================================
        # COMMIT
        # ==========================================

        db.commit()

        # Update session
        session["fullname"] = fullname

        print("========================================")
        print("PROFILE SAVED SUCCESSFULLY")
        print("Email:", email)
        print("Skills:", skills)
        print("Projects:", projects)
        print("Certifications:", certifications)
        print("GitHub:", github)
        print("LinkedIn:", linkedin)
        print("Photo:", profile_photo)
        print("========================================")

        flash(
            "Profile updated successfully!",
            "success"
        )

        return redirect(
            url_for("profile")
        )

    except Exception as e:

        print("========================================")
        print("SAVE PROFILE ERROR")
        print("ERROR:", repr(e))
        print("========================================")

        try:
            db.rollback()
        except Exception:
            pass

        flash(
            "Unable to save profile: " + str(e),
            "error"
        )

        return redirect(
            url_for("profile")
        )
@app.route("/set-target-career", methods=["POST"])
def set_target_career():

    career = request.form.get("career")

    if not career:
        return redirect(url_for("career"))

    session["target_career"] = career

    return redirect(url_for("skill_gap"))
# =========================================================
# PROFILE PAGE
# =========================================================


@app.route("/career")
def career():

    print("====================================")
    print("CAREER PAGE SESSION DATA")
    print("Resume Uploaded:", session.get("resume_uploaded"))
    print("Resume Score:", session.get("resume_score"))
    print("Detected Skills:", session.get("detected_skills"))
    print("Missing Skills:", session.get("missing_skills"))
    print("====================================")

    # =====================================================
    # SESSION DATA
    # =====================================================

    resume_uploaded = session.get(
        "resume_uploaded",
        False
    )

    detected_skills = session.get(
        "detected_skills",
        []
    )

    missing_skills = session.get(
        "missing_skills",
        []
    )

    resume_score = session.get(
        "resume_score",
        0
    )

    fullname = session.get(
        "fullname",
        ""
    )

    # =====================================================
    # SAFETY: MAKE SURE SKILLS ARE ALWAYS LISTS
    # =====================================================

    if not isinstance(detected_skills, list):
        detected_skills = []

    if not isinstance(missing_skills, list):
        missing_skills = []

    # =====================================================
    # RESUME NOT UPLOADED
    # =====================================================

    if not resume_uploaded:

        return render_template(
            "career.html",

            fullname=fullname,

            resume_uploaded=False,

            resume_score=0,

            detected_skills=[],

            missing_skills=[],

            recommended_career="Software Developer",

            reason=(
                "Upload and analyze your resume to receive "
                "a personalized career recommendation."
            ),

            other_careers=[
                "Software Developer",
                "AI / Machine Learning Engineer",
                "Data Scientist",
                "Full Stack Developer",
                "Frontend Developer",
                "Backend Developer",
                "Python Developer",
                "Java Developer",
                "Cloud Engineer",
                "Data Analyst",
                "Database Developer"
            ]
        )

    # =====================================================
    # NORMALIZE DETECTED SKILLS
    # =====================================================

    skills = [
        str(skill).lower().strip()
        for skill in detected_skills
        if skill
    ]

    # =====================================================
    # DEFAULT CAREER
    # =====================================================

    recommended_career = "Software Developer"

    reason = (
        "Your current technical skills are suitable "
        "for software development roles."
    )

    # =====================================================
    # AI / MACHINE LEARNING ENGINEER
    # =====================================================

    if (
        "machine learning" in skills
        or "artificial intelligence" in skills
        or "deep learning" in skills
        or "tensorflow" in skills
        or "pytorch" in skills
    ):

        recommended_career = (
            "AI / Machine Learning Engineer"
        )

        reason = (
            "Your resume contains AI, Machine Learning "
            "or Deep Learning skills. These skills strongly "
            "match AI and Machine Learning engineering roles."
        )

    # =====================================================
    # DATA SCIENTIST
    # =====================================================

    elif (
        "python" in skills
        and (
            "pandas" in skills
            or "numpy" in skills
            or "data science" in skills
            or "statistics" in skills
        )
    ):

        recommended_career = "Data Scientist"

        reason = (
            "Your Python, data processing and analytical "
            "skills make Data Science a strong career option."
        )

    # =====================================================
    # FULL STACK DEVELOPER
    # =====================================================

    elif (
        "html" in skills
        and "css" in skills
        and "javascript" in skills
        and (
            "flask" in skills
            or "django" in skills
            or "node.js" in skills
            or "nodejs" in skills
            or "express" in skills
        )
    ):

        recommended_career = "Full Stack Developer"

        reason = (
            "Your frontend and backend development skills "
            "make Full Stack Development a suitable career path."
        )

    # =====================================================
    # FRONTEND DEVELOPER
    # =====================================================

    elif (
        "html" in skills
        and "css" in skills
        and "javascript" in skills
    ):

        recommended_career = "Frontend Developer"

        reason = (
            "Your HTML, CSS and JavaScript skills strongly "
            "match Frontend Development roles."
        )

    # =====================================================
    # BACKEND DEVELOPER
    # =====================================================

    elif (
        "flask" in skills
        or "django" in skills
        or "node.js" in skills
        or "nodejs" in skills
        or "express" in skills
    ):

        recommended_career = "Backend Developer"

        reason = (
            "Your backend technologies and programming skills "
            "match Backend Development roles."
        )

    # =====================================================
    # DATA ANALYST
    # =====================================================

    elif (
        "excel" in skills
        or "power bi" in skills
        or "tableau" in skills
    ):

        recommended_career = "Data Analyst"

        reason = (
            "Your data analysis, reporting or visualization "
            "skills make Data Analytics a suitable career path."
        )

    # =====================================================
    # PYTHON DEVELOPER
    # =====================================================

    elif "python" in skills:

        recommended_career = "Python Developer"

        reason = (
            "Your Python programming skills make Python "
            "Development a suitable career option."
        )

    # =====================================================
    # JAVA DEVELOPER
    # =====================================================

    elif "java" in skills:

        recommended_career = "Java Developer"

        reason = (
            "Your Java programming skills are suitable "
            "for Java Development roles."
        )

    # =====================================================
    # DATABASE DEVELOPER
    # =====================================================

    elif (
        "sql" in skills
        or "mysql" in skills
        or "postgresql" in skills
        or "mongodb" in skills
    ):

        recommended_career = "Database Developer"

        reason = (
            "Your SQL and database skills are suitable "
            "for database-oriented development roles."
        )

    # =====================================================
    # ALL AVAILABLE CAREERS
    # =====================================================

    all_careers = [

        "Software Developer",

        "AI / Machine Learning Engineer",

        "Data Scientist",

        "Full Stack Developer",

        "Frontend Developer",

        "Backend Developer",

        "Python Developer",

        "Java Developer",

        "Cloud Engineer",

        "Data Analyst",

        "Database Developer"

    ]

    # =====================================================
    # OTHER CAREERS
    # =====================================================

    other_careers = [

        career_name

        for career_name in all_careers

        if career_name != recommended_career

    ]

    # =====================================================
    # SAVE RECOMMENDED CAREER
    # =====================================================

    session["recommended_career"] = recommended_career

    if not session.get("target_career_manual", False):
      session["target_career"] = recommended_career

    # =====================================================
    # RENDER CAREER PAGE
    # =====================================================

    return render_template(

        "career.html",

        fullname=fullname,

        resume_uploaded=True,

        resume_score=resume_score,

        detected_skills=detected_skills,

        missing_skills=missing_skills,

        recommended_career=recommended_career,

        reason=reason,

        other_careers=other_careers

    )
@app.route("/placement")
def placement():

    # ==========================================
    # Get Logged-in Student
    # ==========================================

    email = session.get("email")

    if not email:
        return redirect(url_for("login"))

    # ==========================================
    # Get Student Data From Database
    # ==========================================

    cursor.execute("""
        SELECT
            fullname,
            cgpa
        FROM users
        WHERE email = %s
    """, (email,))

    user = cursor.fetchone()

    if not user:
        return redirect(url_for("login"))

    fullname = user[0]
    cgpa = user[1] or 0

    # ==========================================
    # Convert CGPA
    # ==========================================

    try:
        cgpa = float(cgpa)
    except:
        cgpa = 0

    # ==========================================
    # Get Resume Analyzer Data
    # ==========================================

    resume_score = session.get("resume_score", 0)
    detected_skills = session.get("detected_skills", [])
    missing_skills = session.get("missing_skills", [])

    # ==========================================
    # If Resume is Not Analyzed
    # ==========================================

    if not detected_skills:

        return render_template(
            "placement.html",
            fullname=fullname,
            analyzed=False,
            resume_score=0,
            skill_score=0,
            academic_score=0,
            placement_probability=0,
            readiness="Not Available",
            readiness_text="Please analyze your resume first.",
            strengths=[],
            improvements=[],
            detected_skills=[],
            missing_skills=[]
        )

    # ==========================================
    # Important Placement Skills
    # ==========================================

    important_skills = [
        "python",
        "java",
        "sql",
        "html",
        "css",
        "javascript",
        "git",
        "github",
        "mysql",
        "machine learning"
    ]

    # ==========================================
    # Normalize Detected Skills
    # ==========================================

    normalized_skills = [
        skill.lower().strip()
        for skill in detected_skills
    ]

    # ==========================================
    # Calculate Skill Score
    # ==========================================

    skill_count = 0

    for skill in important_skills:

        if skill.lower() in normalized_skills:
            skill_count += 1

    skill_score = int(
        (skill_count / len(important_skills)) * 100
    )

    # ==========================================
    # Academic Score
    # ==========================================

    if cgpa > 0:

        academic_score = int(
            min((cgpa / 10) * 100, 100)
        )

    else:

        academic_score = 0

    # ==========================================
    # Placement Prediction
    # ==========================================

    if academic_score > 0:

        placement_probability = int(
            (resume_score * 0.35)
            + (skill_score * 0.40)
            + (academic_score * 0.25)
        )

    else:

        placement_probability = int(
            (resume_score * 0.45)
            + (skill_score * 0.55)
        )

    # ==========================================
    # Keep Between 0 - 100
    # ==========================================

    placement_probability = max(
        0,
        min(placement_probability, 100)
    )

    # ==========================================
    # Readiness Level
    # ==========================================

    if placement_probability >= 85:

        readiness = "Excellent"

        readiness_text = (
            "You are highly prepared for placement opportunities."
        )

    elif placement_probability >= 70:

        readiness = "Good"

        readiness_text = (
            "You have a strong foundation but can improve a few areas."
        )

    elif placement_probability >= 50:

        readiness = "Moderate"

        readiness_text = (
            "You are progressing well. Focus on your skill gaps."
        )

    else:

        readiness = "Needs Improvement"

        readiness_text = (
            "Strengthen your technical skills and resume before placements."
        )

    # ==========================================
    # Strong Factors
    # ==========================================

    strengths = []

    if resume_score >= 75:

        strengths.append(
            "Strong resume profile"
        )

    if skill_score >= 70:

        strengths.append(
            "Good technical skill coverage"
        )

    if academic_score >= 75:

        strengths.append(
            "Good academic performance"
        )

    if "python" in normalized_skills:

        strengths.append(
            "Python knowledge"
        )

    if "machine learning" in normalized_skills:

        strengths.append(
            "Machine Learning knowledge"
        )

    if not strengths:

        strengths.append(
            "You have started building your placement profile."
        )

    # ==========================================
    # Areas To Improve
    # ==========================================

    improvements = []

    if resume_score < 75:

        improvements.append(
            "Improve your resume score"
        )

    if skill_score < 70:

        improvements.append(
            "Develop more placement-oriented technical skills"
        )

    if missing_skills:

        improvements.append(
            "Work on your identified skill gaps"
        )

    if academic_score < 75:

        improvements.append(
            "Maintain or improve your academic performance"
        )

    improvements.append(
        "Practice technical interview questions"
    )

    improvements.append(
        "Build practical projects"
    )

    # ==========================================
    # Debug Information
    # ==========================================

    print("====================================")
    print("PLACEMENT PREDICTION")
    print("Student:", fullname)
    print("Email:", email)
    print("CGPA:", cgpa)
    print("Academic Score:", academic_score)
    print("Resume Score:", resume_score)
    print("Skill Score:", skill_score)
    print("Placement Probability:", placement_probability)
    print("====================================")

    # ==========================================
    # Render Placement Page
    # ==========================================

    return render_template(
        "placement.html",

        fullname=fullname,

        analyzed=True,

        resume_score=resume_score,

        skill_score=skill_score,

        academic_score=academic_score,

        placement_probability=placement_probability,

        readiness=readiness,

        readiness_text=readiness_text,

        strengths=strengths,

        improvements=improvements,

        detected_skills=detected_skills,

        missing_skills=missing_skills
    )
@app.route("/skill-gap")
def skill_gap():

    # =====================================
    # Get Resume Data
    # =====================================

    detected_skills = session.get("detected_skills", [])
    recommended_career = session.get("recommended_career")

    # =====================================
    # Resume Check
    # =====================================

    if not detected_skills:

        return render_template(
            "skill_gap.html",
            fullname=session.get("fullname"),
            resume_uploaded=False
        )

    # =====================================
    # Default Career
    # =====================================

    if not recommended_career:
        recommended_career = "Software Developer"

    # =====================================
    # Normalize Skills
    # =====================================

    user_skills = [
        skill.lower().strip()
        for skill in detected_skills
    ]

    # =====================================
    # Career Skill Requirements
    # =====================================

    career_requirements = {

        "Frontend Developer": [
            "html",
            "css",
            "javascript",
            "react",
            "git",
            "github",
            "rest api",
            "typescript"
        ],

        "Backend Developer": [
            "python",
            "flask",
            "django",
            "sql",
            "mysql",
            "api",
            "git",
            "github"
        ],

        "Python Full Stack Developer": [
            "python",
            "django",
            "html",
            "css",
            "javascript",
            "sql",
            "mysql",
            "git",
            "github"
        ],

        "AI / Machine Learning Engineer": [
            "python",
            "machine learning",
            "numpy",
            "pandas",
            "scikit-learn",
            "deep learning",
            "tensorflow",
            "git"
        ],

        "Data Scientist": [
            "python",
            "pandas",
            "numpy",
            "sql",
            "machine learning",
            "data science",
            "matplotlib",
            "scikit-learn"
        ],

        "Cloud Engineer": [
            "python",
            "linux",
            "aws",
            "azure",
            "docker",
            "git",
            "cloud computing"
        ],

        "Database / SQL Developer": [
            "sql",
            "mysql",
            "database",
            "python",
            "git"
        ],

        "Software Developer": [
            "python",
            "java",
            "sql",
            "git",
            "github",
            "data structures",
            "javascript"
        ]
    }

    # =====================================
    # Get Required Skills
    # =====================================

    required_skills = career_requirements.get(
        recommended_career,
        career_requirements["Software Developer"]
    )

    # =====================================
    # Find Matched Skills
    # =====================================

    current_skills = []

    for skill in required_skills:

        if skill.lower() in user_skills:

            current_skills.append(skill)

    # =====================================
    # Find Skill Gaps
    # =====================================

    missing_skills = []

    for skill in required_skills:

        if skill.lower() not in user_skills:

            missing_skills.append(skill)

    # =====================================
    # Calculate Readiness
    # =====================================

    total_skills = len(required_skills)

    matched_count = len(current_skills)

    if total_skills > 0:

        readiness = int(
            (matched_count / total_skills) * 100
        )

    else:

        readiness = 0

    # =====================================
    # Skill Priority
    # =====================================

    high_priority = missing_skills[:2]

    medium_priority = missing_skills[2:4]

    low_priority = missing_skills[4:]

    # =====================================
    # Save Skill Gap Data
    # =====================================

    session["skill_gap_readiness"] = readiness
    session["current_skills"] = current_skills
    session["skill_gap_missing"] = missing_skills

    # =====================================
    # Render
    # =====================================

    return render_template(
        "skill_gap.html",

        fullname=session.get("fullname"),

        resume_uploaded=True,

        recommended_career=recommended_career,

        current_skills=current_skills,

        missing_skills=missing_skills,

        required_skills=required_skills,

        readiness=readiness,

        high_priority=high_priority,

        medium_priority=medium_priority,

        low_priority=low_priority
    )
# =====================================
# Learning Page
# =====================================
# =========================================================
# CAREER BASED LEARNING SYSTEM
# =========================================================

@app.route("/learning")
def learning():

    # -----------------------------------------------------
    # GET CAREER
    # -----------------------------------------------------

    career = request.args.get(
        "career",
        session.get(
            "target_career",
            session.get(
                "recommended_career",
                "Software Developer"
            )
        )
    )

    # -----------------------------------------------------
    # USER DETECTED SKILLS
    # -----------------------------------------------------

    detected_skills = session.get(
        "detected_skills",
        []
    )

    user_skills = [
        str(skill).lower().strip()
        for skill in detected_skills
    ]

    # =====================================================
    # CAREER LEARNING DATA
    # =====================================================

    learning_data = {

        # =================================================
        # SOFTWARE DEVELOPER
        # =================================================

        "Software Developer": {

            "description":
                "Build software applications, solve programming problems and develop reliable software systems.",

            "skills": [
                "Python",
                "Java",
                "Programming Fundamentals",
                "Object-Oriented Programming",
                "Data Structures",
                "Algorithms",
                "SQL",
                "Git",
                "GitHub",
                "JavaScript",
                "REST APIs",
                "Problem Solving"
            ],

            "roadmap": [
                {
                    "title": "Programming Fundamentals",
                    "topics":
                        "Variables, data types, conditions, loops, functions and basic problem solving."
                },
                {
                    "title": "Object-Oriented Programming",
                    "topics":
                        "Classes, objects, inheritance, polymorphism, abstraction and encapsulation."
                },
                {
                    "title": "Data Structures",
                    "topics":
                        "Arrays, strings, linked lists, stacks, queues, trees, hash tables and graphs."
                },
                {
                    "title": "Algorithms",
                    "topics":
                        "Searching, sorting, recursion, time complexity and algorithmic problem solving."
                },
                {
                    "title": "SQL & Databases",
                    "topics":
                        "Tables, CRUD operations, SELECT, WHERE, JOIN, GROUP BY and database design."
                },
                {
                    "title": "Git & GitHub",
                    "topics":
                        "Repositories, commits, branches, pull requests and project collaboration."
                },
                {
                    "title": "REST APIs",
                    "topics":
                        "HTTP methods, JSON, API requests, authentication and backend communication."
                },
                {
                    "title": "JavaScript",
                    "topics":
                        "Variables, functions, arrays, objects, DOM, events and asynchronous programming."
                },
                {
                    "title": "Real-World Projects",
                    "topics":
                        "Build practical applications and publish your projects on GitHub."
                }
            ]
        },

        # =================================================
        # AI / MACHINE LEARNING
        # =================================================

        "AI / Machine Learning Engineer": {

            "description":
                "Build intelligent systems using machine learning, deep learning, AI and real-world data.",

            "skills": [
                "Python",
                "NumPy",
                "Pandas",
                "Statistics",
                "Probability",
                "Linear Algebra",
                "Machine Learning",
                "Scikit-learn",
                "Deep Learning",
                "TensorFlow",
                "PyTorch",
                "NLP",
                "Computer Vision",
                "Generative AI",
                "Git",
                "Model Deployment"
            ],

            "roadmap": [
                {
                    "title": "Python for AI",
                    "topics":
                        "Python fundamentals, functions, OOP, modules and file handling."
                },
                {
                    "title": "NumPy & Pandas",
                    "topics":
                        "Arrays, dataframes, data manipulation, cleaning and transformation."
                },
                {
                    "title": "Mathematics & Statistics",
                    "topics":
                        "Probability, statistics, linear algebra and basic calculus."
                },
                {
                    "title": "Machine Learning",
                    "topics":
                        "Regression, classification, clustering, preprocessing and evaluation."
                },
                {
                    "title": "Scikit-learn",
                    "topics":
                        "Training models, pipelines, feature engineering and model evaluation."
                },
                {
                    "title": "Deep Learning",
                    "topics":
                        "Neural networks, CNN, RNN and deep learning fundamentals."
                },
                {
                    "title": "NLP & Computer Vision",
                    "topics":
                        "Text processing, embeddings, image classification and computer vision basics."
                },
                {
                    "title": "Generative AI",
                    "topics":
                        "LLMs, prompts, embeddings, RAG and AI application development."
                },
                {
                    "title": "Model Deployment",
                    "topics":
                        "Flask/FastAPI, REST APIs, Docker and cloud deployment."
                },
                {
                    "title": "AI Projects",
                    "topics":
                        "Build prediction systems, chatbots, recommendation systems and AI applications."
                }
            ]
        },

        # =================================================
        # DATA SCIENTIST
        # =================================================

        "Data Scientist": {

            "description":
                "Use data, statistics and machine learning to discover insights and build predictive models.",

            "skills": [
                "Python",
                "Statistics",
                "Probability",
                "NumPy",
                "Pandas",
                "SQL",
                "Data Cleaning",
                "Data Visualization",
                "Matplotlib",
                "Machine Learning",
                "Scikit-learn",
                "Git"
            ],

            "roadmap": [
                {
                    "title": "Python for Data Science",
                    "topics":
                        "Python fundamentals, functions, OOP and data handling."
                },
                {
                    "title": "Statistics & Probability",
                    "topics":
                        "Mean, median, variance, distributions, probability and hypothesis testing."
                },
                {
                    "title": "NumPy",
                    "topics":
                        "Arrays, mathematical operations and numerical computing."
                },
                {
                    "title": "Pandas",
                    "topics":
                        "Dataframes, data cleaning, filtering, grouping and transformation."
                },
                {
                    "title": "SQL",
                    "topics":
                        "Queries, joins, aggregations, subqueries and database analysis."
                },
                {
                    "title": "Data Visualization",
                    "topics":
                        "Matplotlib, charts, graphs and exploratory data analysis."
                },
                {
                    "title": "Machine Learning",
                    "topics":
                        "Regression, classification, clustering and model evaluation."
                },
                {
                    "title": "Data Science Projects",
                    "topics":
                        "Work with real-world datasets and create predictive analytics projects."
                }
            ]
        },

        # =================================================
        # FULL STACK
        # =================================================

        "Full Stack Developer": {

            "description":
                "Build complete web applications using frontend, backend, databases and APIs.",

            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Python",
                "Flask",
                "Node.js",
                "SQL",
                "REST APIs",
                "Git",
                "GitHub",
                "Deployment"
            ],

            "roadmap": [
                {
                    "title": "HTML",
                    "topics":
                        "Semantic HTML, forms, tables and page structure."
                },
                {
                    "title": "CSS",
                    "topics":
                        "Flexbox, Grid, responsive design, layouts and animations."
                },
                {
                    "title": "JavaScript",
                    "topics":
                        "DOM, events, functions, arrays, objects and async programming."
                },
                {
                    "title": "React",
                    "topics":
                        "Components, props, state, hooks, routing and API integration."
                },
                {
                    "title": "Backend Development",
                    "topics":
                        "Flask, Node.js, routes, authentication and server-side logic."
                },
                {
                    "title": "Databases",
                    "topics":
                        "SQL, CRUD, joins and database integration."
                },
                {
                    "title": "REST APIs",
                    "topics":
                        "API design, JSON, authentication and frontend-backend communication."
                },
                {
                    "title": "Deployment",
                    "topics":
                        "Deploy full-stack applications and configure production environments."
                }
            ]
        },

        # =================================================
        # FRONTEND
        # =================================================

        "Frontend Developer": {

            "description":
                "Create responsive, interactive and user-friendly websites and web applications.",

            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive Design",
                "DOM",
                "React",
                "REST APIs",
                "Git",
                "GitHub",
                "UI/UX Basics"
            ],

            "roadmap": [
                {
                    "title": "HTML",
                    "topics":
                        "Semantic HTML, forms, tables and page structure."
                },
                {
                    "title": "CSS",
                    "topics":
                        "Flexbox, Grid, animations, responsive layouts and accessibility."
                },
                {
                    "title": "JavaScript",
                    "topics":
                        "Variables, functions, arrays, objects, DOM and events."
                },
                {
                    "title": "Advanced JavaScript",
                    "topics":
                        "Promises, async/await, fetch API and modules."
                },
                {
                    "title": "React",
                    "topics":
                        "Components, props, state, hooks and routing."
                },
                {
                    "title": "Git & GitHub",
                    "topics":
                        "Version control, repositories and collaboration."
                },
                {
                    "title": "Frontend Projects",
                    "topics":
                        "Portfolio, dashboard, e-commerce UI and responsive applications."
                }
            ]
        },

        # =================================================
        # BACKEND
        # =================================================

        "Backend Developer": {

            "description":
                "Develop server-side applications, APIs, databases and backend systems.",

            "skills": [
                "Python",
                "Flask",
                "Django",
                "Node.js",
                "SQL",
                "MySQL",
                "REST APIs",
                "Authentication",
                "Git",
                "GitHub",
                "Testing",
                "Deployment"
            ],

            "roadmap": [
                {
                    "title": "Programming Fundamentals",
                    "topics":
                        "Python or JavaScript fundamentals and object-oriented programming."
                },
                {
                    "title": "Backend Framework",
                    "topics":
                        "Flask, Django or Node.js and server-side development."
                },
                {
                    "title": "Databases",
                    "topics":
                        "SQL, database relationships, joins and CRUD operations."
                },
                {
                    "title": "REST APIs",
                    "topics":
                        "GET, POST, PUT, DELETE, JSON and API architecture."
                },
                {
                    "title": "Authentication",
                    "topics":
                        "Login systems, sessions, JWT and authorization."
                },
                {
                    "title": "Testing",
                    "topics":
                        "Unit testing, API testing and debugging."
                },
                {
                    "title": "Backend Projects",
                    "topics":
                        "Build APIs, authentication systems and database-driven applications."
                }
            ]
        },

        # =================================================
        # PYTHON
        # =================================================

        "Python Developer": {

            "description":
                "Develop applications and backend systems using Python and its ecosystem.",

            "skills": [
                "Python",
                "OOP",
                "Data Structures",
                "Algorithms",
                "Flask",
                "Django",
                "SQL",
                "REST APIs",
                "Git",
                "Testing"
            ],

            "roadmap": [
                {
                    "title": "Python Fundamentals",
                    "topics":
                        "Variables, data types, conditions, loops and functions."
                },
                {
                    "title": "Python OOP",
                    "topics":
                        "Classes, objects, inheritance and encapsulation."
                },
                {
                    "title": "Data Structures & Algorithms",
                    "topics":
                        "Lists, tuples, dictionaries, sets, stacks, queues and algorithms."
                },
                {
                    "title": "Flask / Django",
                    "topics":
                        "Routes, templates, forms, authentication and backend development."
                },
                {
                    "title": "SQL",
                    "topics":
                        "Queries, joins, CRUD operations and database integration."
                },
                {
                    "title": "REST APIs",
                    "topics":
                        "Build and consume APIs using JSON and HTTP."
                },
                {
                    "title": "Python Projects",
                    "topics":
                        "Build practical applications and backend projects."
                }
            ]
        },

        # =================================================
        # JAVA
        # =================================================

        "Java Developer": {

            "description":
                "Build scalable software applications using Java and object-oriented programming.",

            "skills": [
                "Java",
                "OOP",
                "Data Structures",
                "Algorithms",
                "Collections",
                "Exception Handling",
                "SQL",
                "Spring Boot",
                "REST APIs",
                "Git"
            ],

            "roadmap": [
                {
                    "title": "Java Fundamentals",
                    "topics":
                        "Variables, operators, conditions, loops and methods."
                },
                {
                    "title": "Object-Oriented Programming",
                    "topics":
                        "Classes, objects, inheritance, polymorphism and abstraction."
                },
                {
                    "title": "Java Collections",
                    "topics":
                        "ArrayList, LinkedList, HashMap, HashSet and iterators."
                },
                {
                    "title": "Data Structures & Algorithms",
                    "topics":
                        "Arrays, strings, trees, searching, sorting and problem solving."
                },
                {
                    "title": "SQL",
                    "topics":
                        "Queries, joins, CRUD operations and database integration."
                },
                {
                    "title": "Spring Boot",
                    "topics":
                        "Controllers, services, repositories and backend applications."
                },
                {
                    "title": "Java Projects",
                    "topics":
                        "Build REST APIs and complete Java applications."
                }
            ]
        },

        # =================================================
        # CLOUD
        # =================================================

        "Cloud Engineer": {

            "description":
                "Design, deploy and maintain scalable cloud infrastructure and applications.",

            "skills": [
                "Linux",
                "Networking",
                "AWS",
                "Azure",
                "GCP",
                "Cloud Fundamentals",
                "Docker",
                "Kubernetes",
                "Git",
                "CI/CD",
                "Security",
                "Monitoring"
            ],

            "roadmap": [
                {
                    "title": "Linux Fundamentals",
                    "topics":
                        "Commands, files, permissions, processes and shell basics."
                },
                {
                    "title": "Networking",
                    "topics":
                        "IP, DNS, HTTP, HTTPS, ports and networking fundamentals."
                },
                {
                    "title": "Cloud Fundamentals",
                    "topics":
                        "Compute, storage, databases, networking and IAM."
                },
                {
                    "title": "AWS / Azure / GCP",
                    "topics":
                        "Learn one major cloud platform and deploy applications."
                },
                {
                    "title": "Docker",
                    "topics":
                        "Images, containers, Dockerfiles and deployment."
                },
                {
                    "title": "Kubernetes",
                    "topics":
                        "Pods, deployments, services and container orchestration."
                },
                {
                    "title": "CI/CD",
                    "topics":
                        "Automation, pipelines and continuous deployment."
                },
                {
                    "title": "Cloud Projects",
                    "topics":
                        "Deploy real-world applications using cloud infrastructure."
                }
            ]
        },

        # =================================================
        # DATA ANALYST
        # =================================================

        "Data Analyst": {

            "description":
                "Analyze business data and create insights, reports and dashboards for decision making.",

            "skills": [
                "Excel",
                "SQL",
                "Python",
                "Pandas",
                "Statistics",
                "Data Cleaning",
                "Power BI",
                "Tableau",
                "Data Visualization",
                "Communication"
            ],

            "roadmap": [
                {
                    "title": "Excel",
                    "topics":
                        "Formulas, functions, pivot tables and data cleaning."
                },
                {
                    "title": "SQL",
                    "topics":
                        "SELECT, WHERE, JOIN, GROUP BY, subqueries and aggregations."
                },
                {
                    "title": "Statistics",
                    "topics":
                        "Descriptive statistics, probability and correlation."
                },
                {
                    "title": "Python for Analytics",
                    "topics":
                        "Python, Pandas and data manipulation."
                },
                {
                    "title": "Data Visualization",
                    "topics":
                        "Charts, dashboards and data storytelling."
                },
                {
                    "title": "Power BI / Tableau",
                    "topics":
                        "Interactive dashboards and business reports."
                },
                {
                    "title": "Analytics Projects",
                    "topics":
                        "Sales analysis, customer analysis and business dashboards."
                }
            ]
        },

        # =================================================
        # DATABASE
        # =================================================

        "Database Developer": {

            "description":
                "Design, develop and manage databases and data-driven applications.",

            "skills": [
                "SQL",
                "MySQL",
                "Database Design",
                "CRUD",
                "Joins",
                "Indexes",
                "Normalization",
                "Stored Procedures",
                "Python",
                "Git"
            ],

            "roadmap": [
                {
                    "title": "SQL Fundamentals",
                    "topics":
                        "SELECT, INSERT, UPDATE, DELETE, WHERE and ORDER BY."
                },
                {
                    "title": "Joins & Aggregations",
                    "topics":
                        "INNER JOIN, LEFT JOIN, GROUP BY, HAVING and aggregate functions."
                },
                {
                    "title": "Database Design",
                    "topics":
                        "Tables, relationships, primary keys and foreign keys."
                },
                {
                    "title": "Normalization",
                    "topics":
                        "1NF, 2NF, 3NF and database optimization."
                },
                {
                    "title": "Indexes & Performance",
                    "topics":
                        "Indexes, query optimization and database performance."
                },
                {
                    "title": "MySQL Projects",
                    "topics":
                        "Build real-world database-driven applications."
                }
            ]
        }
    }

       # -----------------------------------------------------
    # HANDLE DATABASE / SQL NAME
    # -----------------------------------------------------

    if career == "Database / SQL Developer":
        career = "Database Developer"


    # -----------------------------------------------------
    # FALLBACK
    # -----------------------------------------------------

    if career not in learning_data:
        career = "Software Developer"


    # -----------------------------------------------------
    # GET SELECTED CAREER COURSE
    # -----------------------------------------------------

    course = learning_data[career]


    # -----------------------------------------------------
    # PREPARE LEARNING COURSES
    # -----------------------------------------------------

    courses = []

    for item in course["roadmap"]:

        courses.append({
            "title": item["title"],
            "description": item["topics"],
            "topics": [
                item["topics"]
            ],
            "icon": "fa-book"
        })


    # -----------------------------------------------------
    # FIND EXISTING / MISSING SKILLS
    # -----------------------------------------------------

    existing_skills = []
    missing_skills = []

    for required_skill in course["skills"]:

        required_normalized = (
            required_skill.lower().strip()
        )

        found = False

        for user_skill in user_skills:

            user_normalized = (
                user_skill.lower().strip()
            )

            if (
                required_normalized in user_normalized
                or user_normalized in required_normalized
            ):
                found = True
                break

        if found:
            existing_skills.append(
                required_skill
            )
        else:
            missing_skills.append(
                required_skill
            )


    # -----------------------------------------------------
    # PROGRESS
    # -----------------------------------------------------

    total_skills = len(course["skills"])

    completed_count = len(existing_skills)

    if total_skills > 0:

        progress = int(
            (completed_count / total_skills) * 100
        )

    else:

        progress = 0


    # -----------------------------------------------------
    # SAVE SELECTED CAREER
    # -----------------------------------------------------

    session["learning_career"] = career


    # -----------------------------------------------------
    # RENDER LEARNING PAGE
    # -----------------------------------------------------

    return render_template(
        "learning.html",

        fullname=session.get(
            "fullname",
            ""
        ),

        career=career,

        description=course[
            "description"
        ],

        required_skills=course[
            "skills"
        ],

        existing_skills=existing_skills,

        missing_skills=missing_skills,

        roadmap=course[
            "roadmap"
        ],

        courses=courses,

        progress=progress
    )
@app.route("/learning/notes")
def learning_notes():

    skill = request.args.get(
        "skill",
        "Data Structures"
    )

    return render_template(
        "learning_notes.html",
        skill=skill
    )
@app.route("/reset-password", methods=["GET", "POST"])
def reset_password():

    if request.method == "POST":

        password = request.form["password"]
        email = session.get("reset_email")

        sql = "UPDATE users SET password=%s WHERE email=%s"
        cursor.execute(sql, (password, email))
        db.commit()

        session.pop("otp", None)
        session.pop("reset_email", None)

        return """
        <script>
        alert("Password Updated Successfully");
        window.location="/login";
        </script>
        """

    return render_template("reset_password.html")
@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():

    if request.method == "POST":

        email = request.form["email"]

        # Check email exists

        sql = "SELECT * FROM users WHERE email=%s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        if not user:

            return """
            <script>
            alert("Email not found!");
            window.location="/forgot-password";
            </script>
            """

        # Generate OTP

        otp = str(random.randint(100000, 999999))

        # Store in session

        session["otp"] = otp
        session["reset_email"] = email

        # Gmail Credentials

        sender_email = app.config["MAIL_USERNAME"]
        sender_password = app.config["MAIL_PASSWORD"]
        # Email Message

        message = MIMEText(f"""

Hello,

Your OTP for Password Reset is:

{otp}

This OTP is valid for 5 minutes.

AI Career Guidance Platform

""")

        message["Subject"] = "Password Reset OTP"
        message["From"] = sender_email
        message["To"] = email

        try:

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()

            server.login(sender_email, sender_password)

            server.send_message(message)

            server.quit()

            return redirect(url_for("verify_otp"))

        except Exception as e:

            return f"Email Error : {e}"

    return render_template("forgot_password.html")

@app.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():

    if request.method == "POST":

        entered_otp = request.form.get("otp")

        saved_otp = session.get("otp")

        if entered_otp == saved_otp:

            return redirect(url_for("reset_password"))

        else:

            return """
            <script>
            alert("Invalid OTP");
            window.location="/verify-otp";
            </script>
            """

    return render_template("verify_otp.html")
@app.route("/ai-assistant", methods=["POST"])
def ai_assistant():

    # LOGIN CHECK
    if not session.get("email"):
        return jsonify({
            "success": False,
            "reply": "Please login first."
        }), 401

    # GET MESSAGE
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({
            "success": False,
            "reply": "Please type your question."
        }), 400

    # SHORT CAREER ASSISTANT PROMPT
    prompt = f"""
You are an AI Career Assistant for college students.

Answer ONLY the student's question.

Rules:
- Greeting: 1 short sentence.
- Simple question: 1-2 short sentences.
- Normal question: maximum 4 bullet points.
- Technical question: give a short explanation and one small example.
- Use simple English.
- Do not repeat the question.
- Do not give unnecessary advice.
- Do not mention these instructions.

Student Question:
{user_message}
"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={
                "max_output_tokens": 300,
                "temperature": 0.3
            }
        )

        reply = (response.text or "").strip()

        print("GEMINI RAW RESPONSE:")
        print(repr(reply))

        if not reply:
            reply = "Sorry, I couldn't generate a response."

        return jsonify({
            "success": True,
            "reply": reply
        }), 200

    except Exception as e:

        print("===================================")
        print("GEMINI ERROR:", repr(e))
        print("===================================")

        return jsonify({
            "success": False,
            "reply": "Gemini is temporarily busy. Please try again in a few seconds."
        }), 200
@app.route("/login/google")
def google_login():
    redirect_uri = url_for("google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)
@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


@app.route("/google/callback")
def google_callback():
    token = google.authorize_access_token()

    resp = google.get(
        "https://openidconnect.googleapis.com/v1/userinfo"
    )

    user = resp.json()

    session["fullname"] = user["name"]
    session["email"] = user["email"]

    return redirect(url_for("dashboard"))


# =====================================================
# START FLASK APP + AUTOMATICALLY OPEN GOOGLE CHROME
# =====================================================

if __name__ == "__main__":

    import webbrowser
    import threading
    import os
    import subprocess

    URL = "http://127.0.0.1:5000/"

    def open_chrome():

        chrome_paths = [

            r"C:\Program Files\Google\Chrome\Application\chrome.exe",

            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",

            os.path.expandvars(
                r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
            )

        ]

        chrome_found = False

        for chrome_path in chrome_paths:

            if os.path.exists(chrome_path):

                try:

                    subprocess.Popen([
                        chrome_path,
                        URL
                    ])

                    chrome_found = True

                    print("Google Chrome opened automatically.")

                    break

                except Exception as error:

                    print(
                        "Could not open Chrome:",
                        error
                    )

        # If Chrome path is not found,
        # open the default browser instead.

        if not chrome_found:

            print(
                "Google Chrome was not found. Opening default browser."
            )

            webbrowser.open(URL)


    # Open Chrome after Flask starts
    threading.Timer(
        1.5,
        open_chrome
    ).start()


    app.run(
        debug=True,
        use_reloader=False
    )