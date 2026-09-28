# ==========================================
# AI Career Guidance & Placement Platform
# config.py
# ==========================================

import os

class Config:

    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "AI_CAREER_GUIDANCE_SECRET_KEY"
    )

    
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

    MYSQL_HOST = "localhost"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = "root"
    MYSQL_DB = "ai_career_platform"

    DEBUG = True
    JSON_SORT_KEYS = False

    DEFAULT_RESUME_SCORE = 0
    DEFAULT_PLACEMENT_CHANCE = 0
    DEFAULT_INTERVIEW_SCORE = 0

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")

    RESUME_UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    # ==========================
    # Email Configuration
    # ==========================
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    # ==========================
# Adzuna Job API
# ==========================
# ==========================
# Adzuna Job API
# ==========================

   



    ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
    ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")