# ==========================================
# AI Career Guidance & Placement Platform
# routes/auth.py
# ==========================================

from flask import Blueprint, request, jsonify

# Create Blueprint
auth_bp = Blueprint("auth", __name__)

# ------------------------------------------
# Register User
# ------------------------------------------
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    fullname = data.get("fullname")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # Validation
    if not fullname or not email or not phone or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    # TODO:
    # Save user into MySQL database

    return jsonify({
        "success": True,
        "message": "Registration Successful!"
    }), 201


# ------------------------------------------
# Login User
# ------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and Password are required."
        }), 400

    # TODO:
    # Check user from MySQL database

    return jsonify({
        "success": True,
        "message": "Login Successful!"
    }), 200


# ------------------------------------------
# Logout
# ------------------------------------------
@auth_bp.route("/logout", methods=["GET"])
def logout():

    return jsonify({
        "success": True,
        "message": "Logged Out Successfully"
    })


# ------------------------------------------
# Forgot Password
# ------------------------------------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()

    email = data.get("email")

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400

    return jsonify({
        "success": True,
        "message": "Password reset link sent successfully."
    })


# ------------------------------------------
# Change Password
# ------------------------------------------
@auth_bp.route("/change-password", methods=["POST"])
def change_password():

    data = request.get_json()

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({
            "success": False,
            "message": "Both passwords are required."
        }), 400

    return jsonify({
        "success": True,
        "message": "Password changed successfully."
    })