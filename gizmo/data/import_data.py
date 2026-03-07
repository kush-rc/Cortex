"""
Data Import Script for GIZMO
Imports product data from JSON to MongoDB
"""
import json
import os
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = "AllItemDetails"

def get_db():
    """Get MongoDB database connection."""
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def import_products():
    """Import products from JSON file to MongoDB."""
    # Path to product data
    json_path = Path(__file__).parent.parent.parent.parent / "ECommerce-main" / "AllItemDetails.itemDetails.json"
    
    if not json_path.exists():
        # Try alternate path
        json_path = Path(__file__).parent.parent.parent / "data" / "products.json"
    
    if not json_path.exists():
        print(f"❌ Product file not found at {json_path}")
        return False
    
    print(f"📦 Loading products from {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    # Clean products - remove MongoDB extended JSON _id format
    cleaned_products = []
    for product in products:
        # Remove _id to let MongoDB generate new ones
        if "_id" in product:
            del product["_id"]
        cleaned_products.append(product)
    
    db = get_db()
    collection = db["itemDetails"]
    
    # Clear existing and insert fresh
    collection.delete_many({})
    
    if cleaned_products:
        result = collection.insert_many(cleaned_products)
        print(f"✅ Imported {len(result.inserted_ids)} products")
    else:
        print("❌ No products to import")
        return False
    
    return True

def create_sample_orders():
    """Create sample orders for testing."""
    db = get_db()
    products = list(db["itemDetails"].find().limit(10))
    
    if not products:
        print("❌ No products found. Import products first.")
        return False
    
    orders_collection = db["orders"]
    orders_collection.delete_many({})  # Clear existing
    
    statuses = ["Pending", "Processing", "Shipped", "In Transit", "Delivered"]
    
    sample_orders = []
    for i in range(20):
        product = random.choice(products)
        status = random.choice(statuses)
        
        order = {
            "orderId": f"ORD-2026-{1000 + i}",
            "userId": f"user_{random.randint(1, 5)}",
            "items": [{
                "itemId": str(product.get("_id", "")),
                "name": product.get("name", "Unknown Product"),
                "price": product.get("price", 0),
                "quantity": random.randint(1, 3)
            }],
            "status": status,
            "total": product.get("price", 0) * random.randint(1, 3),
            "paymentMethod": random.choice(["UPI", "Card", "COD", "NetBanking"]),
            "shippingAddress": f"Address {random.randint(1, 100)}, City",
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 30)),
            "expectedDelivery": datetime.now() + timedelta(days=random.randint(1, 7))
        }
        sample_orders.append(order)
    
    result = orders_collection.insert_many(sample_orders)
    print(f"✅ Created {len(result.inserted_ids)} sample orders")
    return True

def show_stats():
    """Show database statistics."""
    db = get_db()
    
    print("\n📊 Database Statistics:")
    print("-" * 40)
    
    collections = db.list_collection_names()
    for coll_name in collections:
        count = db[coll_name].count_documents({})
        print(f"  {coll_name}: {count} documents")
    
    # Sample product
    sample = db["itemDetails"].find_one()
    if sample:
        print(f"\n📦 Sample Product: {sample.get('name', 'N/A')}")
        print(f"   Category: {sample.get('category', 'N/A')}")
        print(f"   Price: ₹{sample.get('price', 'N/A')}")

if __name__ == "__main__":
    print("=" * 50)
    print("🛢️  GIZMO Data Import Tool")
    print("=" * 50)
    
    print("\n1️⃣ Importing products...")
    import_products()
    
    print("\n2️⃣ Creating sample orders...")
    create_sample_orders()
    
    print("\n3️⃣ Checking database...")
    show_stats()
    
    print("\n✅ Data import complete!")
