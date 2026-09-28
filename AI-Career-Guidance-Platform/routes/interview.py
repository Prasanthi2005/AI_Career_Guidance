# ==========================================
# AI Career Guidance & Placement Platform
# routes/interview.py
# ==========================================

from flask import Blueprint, request, jsonify
import random

# Blueprint
interview_bp = Blueprint("interview", __name__)

# ------------------------------------------
# Interview Questions
# ------------------------------------------

QUESTIONS = [

    "Tell me about yourself.",

    "Why should we hire you?",

    "What are your strengths?",

    "What are your weaknesses?",

    "Explain one AI project you have developed.",

    "What is Machine Learning?",

    "Difference between AI and Deep Learning?",

    "What are your career goals?",

    "Explain Python OOP concepts.",

    "How do you handle work pressure?"

]


# ------------------------------------------
# Get Interview Questions
# ------------------------------------------

@interview_bp.route("/questions", methods=["GET"])
def get_questions():

    return jsonify({

        "success": True,
        "questions": QUESTIONS

    })


# ------------------------------------------
# Submit Interview Answer
# ------------------------------------------

@interview_bp.route("/submit", methods=["POST"])
def submit_answer():

    data = request.get_json()

    question = data.get("question")
    answer = data.get("answer")

    if not question or not answer:

        return jsonify({

            "success": False,
            "message": "Question and Answer are required."

        }), 400

    communication = random.randint(8, 10)
    confidence = random.randint(8, 10)
    technical = random.randint(8, 10)
    grammar = random.randint(8, 10)

    overall = round(
        (communication + confidence + technical + grammar) / 4,
        2
    )

    return jsonify({

        "success": True,

        "communication_score": communication,

        "confidence_score": confidence,

        "technical_score": technical,

        "grammar_score": grammar,

        "overall_score": overall,

        "feedback": [

            "Speak more confidently.",

            "Maintain eye contact.",

            "Provide project-based examples.",

            "Improve technical explanation."

        ]

    })


# ------------------------------------------
# Interview Result
# ------------------------------------------

@interview_bp.route("/result", methods=["GET"])
def interview_result():

    return jsonify({

        "student_name": "Bhavani",

        "overall_score": 9.2,

        "status": "Excellent",

        "recommendation":
        "You are ready for placement interviews."

    })


# ------------------------------------------
# AI Mock Interview
# ------------------------------------------

@interview_bp.route("/mock", methods=["GET"])
def mock_interview():

    return jsonify({

        "title": "AI Mock Interview",

        "total_questions": len(QUESTIONS),

        "duration": "20 Minutes",

        "mode": "Technical + HR"

    })


# ------------------------------------------
# Interview Tips
# ------------------------------------------

@interview_bp.route("/tips", methods=["GET"])
def interview_tips():

    return jsonify({

        "tips": [

            "Research the company.",

            "Practice common HR questions.",

            "Revise technical concepts.",

            "Be confident and smile.",

            "Prepare your project explanation.",

            "Ask questions at the end of the interview."

        ]

    })