import json
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("firebase-key.json")  
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://productdb-c518a-default-rtdb.asia-southeast1.firebasedatabase.app/" 
    })
    print("✅ Firebase Initialized Successfully!")
except Exception as e:
    print(f"❌ Firebase Initialization Failed: {e}")
    exit()

# Reference to Firebase database
ref = db.reference("/products")  # Data will be stored under "products"

try:
    # Load JSON data
    with open("maut.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    
    # Extract sheet data (verify structure)
    if "Sheet1" not in data:
        print("❌ Error: 'Sheet1' not found in JSON. Check the JSON structure.")
        exit()

    products = data["Sheet1"]
    
    if not products:
        print("⚠️ No products found in 'Sheet1'. Please check the JSON structure.")
        exit()

    # Insert each product into Firebase
    for product in products:
        if "final_price" in product:
            try:
                # Ensure final_price is a float
                product["final_price"] = float(str(product["final_price"]).replace(",", "").replace('"', ''))
            except ValueError:
                print(f"⚠️ Warning: Could not convert final_price for product {product}")
                product["final_price"] = 0.0  # Set a default value
                
        ref.push(product)  # Store in Firebase

    print("✅ All data inserted successfully!")

except FileNotFoundError:
    print("❌ Error: maut.json file not found. Please check the file path.")

except json.JSONDecodeError:
    print("❌ Error: Invalid JSON format in maut.json. Please fix any syntax issues.")

except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
