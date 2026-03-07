from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime

cart_bp = Blueprint('cart', __name__)
cart_bp.strict_slashes = False

# DB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["cortex"]
users_collection = db["users"]
products_collection = db["products"]

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    cart = user.get("cart", [])
    return jsonify({"cart": cart}), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    # Verify product exists — search by _id (ObjectId) first, then fallback to name
    product = None
    
    # Extract base ID if it's a composite ID (e.g. "ID-Size-Color")
    base_id = product_id.split('-')[0] if '-' in product_id else product_id
    
    try:
        product = products_collection.find_one({"_id": ObjectId(base_id)})
    except:
        pass
    
    if not product:
        product = products_collection.find_one({"name": base_id})
    
    # If still not found, we only proceed if we have enough info to create a custom item
    if not product and not (data.get('name') and data.get('price')):
        return jsonify({"error": "Product not found and insufficient data for custom item"}), 404

    # Construct cart item with fallbacks to provided data
    cart_item = {
        "productId": product_id,
        "name": data.get('name', product["name"] if product else "Unknown Product"),
        "price": data.get('price', product["price"] if product else 0),
        "image": data.get('image', product.get("image", "") if product else ""),
        "quantity": quantity,
        "specs": data.get('specs', {}) # Support for custom configurations
    }

    # Add to user cart (push if new, or you might want to increment quantity logic here, keeping it simple for now)
    # Simple logic: Check if exists, update quantity, else push
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    current_cart = user.get("cart", [])
    
    # Check if item exists
    item_index = next((index for (index, d) in enumerate(current_cart) if d["productId"] == product_id), None)
    
    if item_index is not None:
        # Update quantity
        current_cart[item_index]["quantity"] += quantity
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"cart": current_cart}}
        )
    else:
        # Add new item
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"cart": cart_item}}
        )

    # Return updated cart
    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "Added to cart", "cart": updated_user.get("cart", [])}), 200

@cart_bp.route('/remove', methods=['POST'])
@jwt_required()
def remove_from_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"cart": {"productId": product_id}}}
    )
    
    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "Removed from cart", "cart": updated_user.get("cart", [])}), 200

@cart_bp.route('/update', methods=['POST'])
@jwt_required()
def update_cart_quantity():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    if quantity < 1:
        # Remove item if quantity is 0 or less
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"cart": {"productId": product_id}}}
        )
    else:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        current_cart = user.get("cart", [])
        for item in current_cart:
            if item["productId"] == product_id:
                item["quantity"] = quantity
                break
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"cart": current_cart}}
        )

    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "Cart updated", "cart": updated_user.get("cart", [])}), 200
