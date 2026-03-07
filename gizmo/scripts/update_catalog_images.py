
import os
from pymongo import MongoClient
from pathlib import Path
from dotenv import load_dotenv

# Load env for MONGO_URI
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["cortex"]
products = db["products"]

STATIC_ROOT = Path("gizmo/static/product_images")

def find_first_image(folder_path):
    full_path = STATIC_ROOT / folder_path
    if not full_path.exists():
        print(f"Warning: Path not found: {full_path}")
        return None
    
    # Priority extensions
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        matches = list(full_path.glob(ext))
        if matches:
            # Return web-accessible path
            return f"/static/product_images/{folder_path}/{matches[0].name}"
    return None

def update_product(name_keyword, folder_path):
    img_path = find_first_image(folder_path)
    if img_path:
        result = products.update_many(
            {"name": {"$regex": name_keyword, "$options": "i"}},
            {"$set": {"image": img_path}}
        )
        print(f"Updated {result.modified_count} products matching '{name_keyword}' -> {img_path}")
    else:
        print(f"No image found for '{name_keyword}' in {folder_path}")

if __name__ == "__main__":
    print("Starting Catalog Image Update...")
    
    # iPhone
    update_product("iPhone 16 Pro", "iphone/iphone 17 pro")
    update_product("iPhone 16", "iphone/iphone16")
    
    # Watch
    update_product("Apple Watch Series", "watch/watch series 11")
    update_product("Apple Watch Ultra", "watch/watch ultra3")
    update_product("Apple Watch SE", "watch/watch SE 3")
    
    # iPad
    update_product("iPad Pro", "ipad/ipadpro")
    update_product("iPad Air", "ipad/ipadair") 
    update_product("iPad mini", "ipad/ipadmini")
    update_product("iPad", "ipad") # Fallback for base iPad if just "iPad"
    
    # Mac
    update_product("MacBook Pro", "Mac/MacBook Pro")
    update_product("MacBook Air", "Mac/Macbook Air 13'' and 15''")
    update_product("iMac", "Mac/imac")
    update_product("Mac mini", "Mac/Macmini")
    update_product("Mac Studio", "Mac/Macstudio")
    update_product("Mac Pro", "Mac/Macpro")
    
    # AirPods
    update_product("AirPods Pro", "airpods/airpods 3") # Assuming 3 is Pro? Or just 3.
    update_product("AirPods Max", "airpods/airpods max")
    update_product("AirPods 4", "airpods/airpods 4")
    
    print("Update Complete!")
