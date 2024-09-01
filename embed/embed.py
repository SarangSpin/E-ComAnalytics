from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import numpy as np

# Connect to MongoDB
client = MongoClient('mongodb+srv://sarangmani007:tXnLBfZFoa0xbhZj@cluster0.47gho.mongodb.net/')
db = client['test']
collection = db['products']  # Replace with your collection name

# Load pre-trained embedding model
model = SentenceTransformer('all-mpnet-base-v2')  # You can use any other model

# Define the fields to exclude
fields_to_exclude = ['Brand', 'Model', 'Model Type', 'Color', 'ratings', 'image', 'url', '_id', 'Price in India', 'embedding']

# Fetch all products from the collection
products = collection.find()

# Process each product to create embeddings
for product in products:
    # Create a list of attribute values, excluding specified fields
    attributes = [str(value) for key, value in product.items() if key not in fields_to_exclude]
    
    # Combine the attributes into a single string
    combined_text = ' '.join(attributes)
    
    # Generate embedding
    embedding = model.encode(combined_text)
    
    # Store the embedding back into the document
    collection.update_one(
        {'_id': product['_id']},
        {'$set': {'embedding': embedding.tolist()}}
    )

print("Embeddings created and stored successfully.")
