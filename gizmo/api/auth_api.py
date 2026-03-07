from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os
import re
from datetime import datetime

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# DB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["cortex"]
users_collection = db["users"]

def serialize_user(user):
    """Convert MongoDB user doc to JSON-serializable dict."""
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "mobile": user.get("mobile", ""),
        "cart": user.get("cart", [])
    }

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    mobile = data.get('mobile')
    password = data.get('password')

    if not username or not email or not mobile or not password:
        return jsonify({"error": "Missing definition"}), 400

    if not re.match(r"^\d{10}$", mobile):
        return jsonify({"error": "Mobile number must be exactly 10 digits"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409
        
    if users_collection.find_one({"mobile": mobile}):
        return jsonify({"error": "Mobile number already registered"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = {
        "username": username,
        "email": email,
        "mobile": mobile,
        "password": hashed_password,
        "cart": [],
        "created_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(new_user)
    
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User created successfully",
        "user": serialize_user(new_user),
        "access_token": access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('email')  # UI still passes it as 'email' state
    password = data.get('password')

    # Find user by email OR mobile number
    user = users_collection.find_one({
        "$or": [
            {"email": identifier},
            {"mobile": identifier}
        ]
    })

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({
            "message": "Login successful",
            "user": serialize_user(user),
            "access_token": access_token
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    from bson.objectid import ObjectId
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    
    if user:
        return jsonify(serialize_user(user)), 200
    else:
        return jsonify({"error": "User not found"}), 404

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    # Front-end should delete the token from local storage
    return response, 200

@auth_bp.route('/update-contact', methods=['PUT'])
@jwt_required()
def update_contact():
    data = request.get_json()
    new_email = data.get('email')
    new_mobile = data.get('mobile')
    
    if not new_email and not new_mobile:
        return jsonify({"error": "Nothing to update"}), 400
        
    current_user_id = get_jwt_identity()
    from bson.objectid import ObjectId
    
    # Check for conflicts
    conflict_query = {"_id": {"$ne": ObjectId(current_user_id)}, "$or": []}
    if new_email:
        conflict_query["$or"].append({"email": new_email})
    if new_mobile:
        if not re.match(r"^\d{10}$", new_mobile):
            return jsonify({"error": "Mobile number must be exactly 10 digits"}), 400
        conflict_query["$or"].append({"mobile": new_mobile})
        
    if conflict_query["$or"]:
        conflict = users_collection.find_one(conflict_query)
        if conflict:
            if new_email and conflict.get("email") == new_email:
                return jsonify({"error": "Email already registered to another account"}), 409
            if new_mobile and conflict.get("mobile") == new_mobile:
                return jsonify({"error": "Mobile number already registered to another account"}), 409

    update_fields = {}
    if new_email: update_fields["email"] = new_email
    if new_mobile: update_fields["mobile"] = new_mobile
    
    users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_fields}
    )
    
    updated_user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    return jsonify({
        "message": "Contact information updated successfully",
        "user": serialize_user(updated_user)
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Mock password reset endpoint.
    In a real app, this would send an email with a reset token.
    For this demo, we'll just simulate success.
    """
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email required"}), 400
        
    user = users_collection.find_one({"email": email})
    if not user:
        # Security best practice: Don't reveal if email exists
        # But for demo/debugging, we might want to be explicit, or just return success
        return jsonify({"message": "If an account exists, a reset link has been sent."}), 200
        
    # Simulate sending email
    print(f"Password reset requested for {email}")
    
    return jsonify({"message": "Reset link sent to email."}), 200
