from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import os
import random
from datetime import datetime, timedelta

orders_bp = Blueprint('orders', __name__)
orders_bp.strict_slashes = False

# DB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["cortex"]
users_collection = db["users"]
orders_collection = db["orders"]


def generate_order_id():
    """Generate a unique order ID like ORD-2026-XXXXX."""
    num = random.randint(10000, 99999)
    year = datetime.now().year
    return f"ORD-{year}-{num}"

def generate_ticket_id():
    """Generate a unique ticket ID like TKT-2026-XXXXX."""
    num = random.randint(10000, 99999)
    year = datetime.now().year
    return f"TKT-{year}-{num}"

# ============ TICKET ENDPOINTS ============

@orders_bp.route('/tickets', methods=['GET'])
@jwt_required()
def get_tickets():
    """Get all support tickets for the authenticated user."""
    user_id = get_jwt_identity()
    tickets_collection = db["tickets"]
    
    # Sort by created_at descending (newest first)
    tickets = list(tickets_collection.find(
        {"user_id": ObjectId(user_id)}
    ).sort("created_at", -1))
    
    # Serialize ObjectId to string for JSON
    for t in tickets:
        t["_id"] = str(t["_id"])
        t["user_id"] = str(t["user_id"])
        
    return jsonify({"tickets": tickets, "count": len(tickets)}), 200

@orders_bp.route('/tickets', methods=['POST'])
@jwt_required()
def create_ticket():
    """Create a new support ticket."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    issue = data.get("issue")
    if not issue:
        return jsonify({"error": "Issue description is required"}), 400
        
    tickets_collection = db["tickets"]
    ticket_id = generate_ticket_id()
    
    ticket_doc = {
        "ticket_id": ticket_id,
        "user_id": ObjectId(user_id),
        "issue": issue,
        "status": "Open", # Options: Open, In Progress, Resolved
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    tickets_collection.insert_one(ticket_doc)
    
    # Serialize for response
    ticket_doc["_id"] = str(ticket_doc["_id"])
    ticket_doc["user_id"] = str(ticket_doc["user_id"])
    
    return jsonify({
        "message": "Ticket created successfully", 
        "ticket": ticket_doc
    }), 201

@orders_bp.route('/address', methods=['GET'])
@jwt_required()
def get_address():
    """Get user's saved shipping address."""
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    address = user.get("address", None)
    return jsonify({"address": address}), 200


@orders_bp.route('/address', methods=['POST'])
@jwt_required()
def save_address():
    """Save or update user's shipping address."""
    user_id = get_jwt_identity()
    data = request.get_json()

    address = {
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "line1": data.get("line1", ""),
        "line2": data.get("line2", ""),
        "city": data.get("city", ""),
        "state": data.get("state", ""),
        "pincode": data.get("pincode", "")
    }

    # Validate required fields
    required = ["name", "phone", "line1", "city", "state", "pincode"]
    missing = [f for f in required if not address.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    # Strict Validation
    if not address["phone"].isdigit() or len(address["phone"]) != 10:
        return jsonify({"error": "Phone number must be exactly 10 digits"}), 400
    
    if not address["pincode"].isdigit() or len(address["pincode"]) != 6:
        return jsonify({"error": "Pincode must be exactly 6 digits"}), 400

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"address": address}}
    )

    return jsonify({"message": "Address saved", "address": address}), 200


# ============ PAYMENT ENDPOINTS ============

@orders_bp.route('/payment', methods=['GET'])
@jwt_required()
def get_payment():
    """Get user's saved payment method."""
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    payment = user.get("payment_method", None)
    return jsonify({"payment": payment}), 200

@orders_bp.route('/payment', methods=['POST'])
@jwt_required()
def save_payment():
    """Save user's preferred payment method."""
    user_id = get_jwt_identity()
    data = request.get_json()

    method = data.get("method")
    if not method:
        return jsonify({"error": "Payment method is required"}), 400

    payment_record = {"method": method}

    if method == "card":
        card_number = data.get("cardNumber", "")
        if not card_number or len(card_number.replace(" ", "")) != 16:
             return jsonify({"error": "Invalid Card Number. Must be 16 digits."}), 400
        payment_record["last4"] = card_number.replace(" ", "")[-4:]
        payment_record["brand"] = "Visa"
        payment_record["expiry"] = data.get("expiry", "12/30")
    elif method == "upi":
        upi_id = data.get("upiId", "")
        if "@" not in upi_id:
             return jsonify({"error": "Invalid UPI ID format"}), 400
        payment_record["upi_id"] = upi_id

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"payment_method": payment_record}}
    )

    return jsonify({"message": "Payment method saved", "payment": payment_record}), 200


# ============ CHECKOUT ENDPOINT ============

@orders_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    """Process checkout: create order from cart, save address + payment, clear cart."""
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    cart = user.get("cart", [])
    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    data = request.get_json()

    # Address (required)
    address = data.get("address")
    if not address:
        return jsonify({"error": "Shipping address is required"}), 400

    # Payment info
    payment = data.get("payment", {})
    payment_method = payment.get("method", "card")

    payment_record = {
        "method": payment_method,
        "status": "paid"
    }

    if payment_method == "card":
        payment_record["last4"] = payment.get("cardNumber", "")[-4:] if payment.get("cardNumber") else "4242"
        payment_record["brand"] = "Visa"
    elif payment_method == "upi":
        payment_record["upi_id"] = payment.get("upiId", "demo@cortex")
    elif payment_method == "bank":
        payment_record["bank"] = "Demo Bank Transfer"
    elif payment_method == "cod":
        payment_record["status"] = "pending"

    # Calculate total
    total = sum(item.get("price", 0) * item.get("quantity", 1) for item in cart)

    # Estimated delivery (5-7 business days)
    est_delivery = (datetime.now() + timedelta(days=random.randint(5, 7))).strftime("%b %d, %Y")

    # Create order document
    order = {
        "user_id": ObjectId(user_id),
        "order_id": generate_order_id(),
        "items": cart,
        "total": total,
        "address": address,
        "payment": payment_record,
        "status": "Processing",
        "estimated_delivery": est_delivery,
        "created_at": datetime.now()
    }

    # Insert order
    result = orders_collection.insert_one(order)
    order_doc_id = str(result.inserted_id)

    # Save address to user profile for future use
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {"address": address, "cart": []}
        }
    )

    return jsonify({
        "message": "Order placed successfully!",
        "order_id": order["order_id"],
        "doc_id": order_doc_id,
        "total": total,
        "estimated_delivery": est_delivery,
        "status": order["status"]
    }), 201


# ============ ORDER HISTORY ENDPOINTS ============

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders for the logged-in user."""
    user_id = get_jwt_identity()

    orders = list(orders_collection.find(
        {"user_id": ObjectId(user_id)}
    ).sort("created_at", -1))

    # Serialize and check lazy delivery status
    current_date = datetime.now()
    for order in orders:
        order["_id"] = str(order["_id"])
        order["user_id"] = str(order["user_id"])
        if "created_at" in order:
            order["created_at"] = order["created_at"].strftime("%b %d, %Y")

        # Lazy Auto-Delivery check
        if order.get("status") not in ["Delivered", "Cancelled", "Returned"]:
            est_del_str = order.get("estimated_delivery")
            if est_del_str:
                try:
                    # Parse "Feb 06, 2026"
                    est_date = datetime.strptime(est_del_str, "%b %d, %Y")
                    # If estimated delivery is today or in the past
                    if est_date.date() <= current_date.date():
                        delivered_time = est_date.replace(hour=14, minute=0)
                        if est_date.date() == current_date.date():
                            delivered_time = current_date
                            
                        delivered_iso = delivered_time.isoformat()
                        orders_collection.update_one(
                            {"order_id": order["order_id"]},
                            {"$set": {
                                "status": "Delivered",
                                "delivered_at": delivered_iso
                            }}
                        )
                        order["status"] = "Delivered"
                        order["delivered_at"] = delivered_iso
                except ValueError:
                    pass

    return jsonify({"orders": orders}), 200


@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get a single order by order_id string (e.g. ORD-2026-12345)."""
    user_id = get_jwt_identity()

    order = orders_collection.find_one({
        "order_id": order_id,
        "user_id": ObjectId(user_id)
    })

    if not order:
        # Try by MongoDB _id
        try:
            order = orders_collection.find_one({
                "_id": ObjectId(order_id),
                "user_id": ObjectId(user_id)
            })
        except:
            pass

    if not order:
        return jsonify({"error": "Order not found"}), 404

    order["_id"] = str(order["_id"])
    order["user_id"] = str(order["user_id"])
    if "created_at" in order:
        order["created_at"] = order["created_at"].strftime("%b %d, %Y")

    return jsonify({"order": order}), 200


# ============ ORDER ACTIONS (Return / Exchange / Cancel) ============

@orders_bp.route('/<order_id>/action', methods=['PATCH'])
@jwt_required()
def order_action(order_id):
    """Update order status for return, exchange, or cancel."""
    user_id = get_jwt_identity()
    data = request.json or {}
    action = data.get("action", "").lower()

    valid_actions = {
        "return": "Return Requested",
        "exchange": "Exchange Requested",
        "cancel": "Cancelled"
    }

    if action not in valid_actions:
        return jsonify({"error": f"Invalid action '{action}'. Must be one of: return, exchange, cancel."}), 400

    new_status = valid_actions[action]

    # Find the order and verify it belongs to this user
    order = orders_collection.find_one({
        "order_id": order_id,
        "user_id": ObjectId(user_id)
    })

    if not order:
        return jsonify({"error": "Order not found or does not belong to you."}), 404

    # Only delivered orders can be returned/exchanged, only processing orders can be cancelled
    current_status = order.get("status", "")
    if action in ["return", "exchange"] and current_status != "Delivered":
        return jsonify({"error": f"Cannot {action} an order that is not delivered. Current status: {current_status}"}), 400
    if action == "cancel" and current_status not in ["Processing", "Confirmed"]:
        return jsonify({"error": f"Cannot cancel an order with status: {current_status}"}), 400

    # Update order status
    orders_collection.update_one(
        {"_id": order["_id"]},
        {"$set": {
            "status": new_status,
            "updated_at": datetime.utcnow(),
            f"{action}_requested_at": datetime.utcnow()
        }}
    )

    return jsonify({
        "success": True,
        "message": f"Order {order_id} has been updated to '{new_status}'.",
        "order_id": order_id,
        "new_status": new_status
    }), 200

