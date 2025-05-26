from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from fastapi import FastAPI, Form, HTTPException
from bson import ObjectId  # Import ObjectId for MongoDB
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from jose import jwt, JWTError
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from datetime import datetime, timedelta

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

# Google OAuth2 config
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "your-google-client-secret")
JWT_ALGORITHM = "HS256"

# Add session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# Authlib OAuth setup
config = Config(environ={
    'GOOGLE_CLIENT_ID': GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': GOOGLE_CLIENT_SECRET,
})
oauth = OAuth(config)
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
    }
)

users_collection = db.users

def create_jwt(user):
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user = users_collection.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.post("/signup")
async def signup(data: dict):
    email = data["email"]
    name = data["name"]
    username = data["username"]
    # Check if username is unique
    if users_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    user = users_collection.find_one({"email": email})
    if user:
        users_collection.update_one({"email": email}, {"$set": {"name": name, "username": username}})
        user = users_collection.find_one({"email": email})
    else:
        user_data = {"email": email, "name": name, "username": username, "created_at": datetime.utcnow()}
        result = users_collection.insert_one(user_data)
        user = users_collection.find_one({"_id": result.inserted_id})
    jwt_token = create_jwt(user)
    return {"token": jwt_token}

@app.get("/auth/callback")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        print("GOOGLE TOKEN:", token)  # Debug
        if "id_token" in token:
            # Decode the id_token directly
            id_token = token["id_token"]
            # You can skip verification for local dev, but in production, verify the signature!
            user_info = jwt.get_unverified_claims(id_token)
        else:
            resp = await oauth.google.get('userinfo', token=token)
            user_info = resp.json()
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")
        # Find or create user
        user = users_collection.find_one({"email": user_info["email"]})
        if not user:
            # Redirect to signup page with email and name as query params
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            return RedirectResponse(f"{frontend_url}/signup?email={user_info['email']}&name={user_info.get('name', '')}")
        elif not user.get("username"):
            # User exists but hasn't completed signup, redirect to signup page
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            return RedirectResponse(f"{frontend_url}/signup?email={user_info['email']}&name={user_info.get('name', '')}")
        else:
            # User is fully registered, issue JWT and redirect to /my-page
            jwt_token = create_jwt(user)
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            return RedirectResponse(f"{frontend_url}/signin-with-google?token={jwt_token}")
    except OAuthError as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.get("/me")
async def get_me(request: Request):
    user = get_current_user(request)
    return {"email": user["email"], "name": user.get("name", "")}

# make posts
@app.post("/api/posts")
async def create_post(
    postTitle: str = Form(...),
    content: str = Form(...),
    date: str = Form(...),
    user: str = Form(...),
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
        print(f"Inserted post with ID: {result.inserted_id}")  # Debug log
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

        return {"posts": posts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get post by userId
@app.get("/api/posts/{userId}")
async def get_posts_by_user(userId: str):
    try:
        # Fetch posts by userId from the database
        posts = list(posts_collection.find({"user": userId}))

        # Convert ObjectId to string for JSON serialization
        for post in posts:
            post["_id"] = str(post["_id"])

        return {"posts": posts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# edit posts
@app.put("/api/posts/{post_id}")
async def update_post(
    post_id: str,
    postTitle: str = Form(...),
    content: str = Form(...),
):
    try:
        # Ensure all required fields are present
        if not all([postTitle, content]):
            raise HTTPException(status_code=400, detail="All required fields must be filled")

        # Convert post_id to ObjectId
        try:
            object_id = ObjectId(post_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid post ID format")

        # Prepare the updated post data
        updated_data = {
            "postTitle": postTitle,
            "content": content,
        }

        # Update the post in the database
        result = posts_collection.update_one({"_id": object_id}, {"$set": updated_data})

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")

        return {"message": "Post updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# delete posts
@app.delete("/api/posts/{post_id}")
async def delete_post(post_id: str):
    try:
        # Convert post_id to ObjectId
        try:
            object_id = ObjectId(post_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid post ID format")

        # Delete the post from the database
        result = posts_collection.delete_one({"_id": object_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")

        return {"message": "Post deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))