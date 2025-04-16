from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from fastapi import FastAPI, Form, HTTPException

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGO_URI"), tlsAllowInvalidCertificates=True, server_api=ServerApi('1'))
db = client.app_db
posts_collection = db.posts

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    collections = db.list_collection_names()
    print(f"Available collections: {collections}")
except Exception as e:
    print(e)

# make posts
@app.post("/api/posts")
async def create_post(
    postTitle: str = Form(...),
    content: str = Form(...),
    date: str = Form(...),
    user="test_user"  # Hardcoded user
):
    try:
        print(f"Received post: {postTitle}, {content}, {date}")  # Debug log

        # Ensure all required fields are present
        if not all([postTitle, content, date]):
            raise HTTPException(status_code=400, detail="All required fields must be filled")

        # Prepare the post data
        post_data = {
            "postTitle": postTitle,
            "user": user,
            "content": content,
            "date": date,
            # "comments": []
            # "likes": 0,
            # "dislikes": 0,
        }

        # Insert the post into the database
        result = posts_collection.insert_one(post_data)

        return {"message": "Post created successfully", "post_id": str(result.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get posts
@app.get("/api/posts")
async def get_posts():
    try:
        # Fetch all posts from the database
        posts = list(posts_collection.find())

        # Convert ObjectId to string for JSON serialization
        for post in posts:
            post["_id"] = str(post["_id"])
            del post["_id"]  # Remove the original "_id" field

        return {"posts": posts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))