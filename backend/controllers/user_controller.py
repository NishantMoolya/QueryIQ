from fastapi.responses import JSONResponse
from core.config import settings
from db.connect import db
from models.user_auth import UserSignup, UserLogin
from utils.user_auth import get_password_hash, verify_password, create_access_token
from bson import ObjectId

users = db["users"]

async def user_signup(user: UserSignup):
    try:
        # Check if email already exists
        if users.find_one({"email": user.email}):
            return JSONResponse(status_code=400,content={"message": "Email already registered"})

        # Hash the password
        hashed_password = get_password_hash(user.password)

        # Prepare user data
        new_user = {
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
        }

        # Insert user into the database
        result = users.insert_one(new_user)

        # Add the inserted ID to the user data
        new_user["_id"] = str(result.inserted_id)

        # Return the created user
        return JSONResponse(status_code=201,content={"message": "User created successfully", "data": new_user})

    except Exception as e:
        # Handle unexpected errors
        print(f"An unexpected error occurred: {str(e)}")
        return JSONResponse(status_code=500,content={"message": f"An unexpected error occurred"})

async def user_login(user: UserLogin):
    try:
        db_user = users.find_one({"email": user.email})
        if not db_user or not verify_password(user.password, db_user["password"]):
            return JSONResponse(status_code=401,content={"message": "Invalid email or password"})
        
        # Successful login
        user_data = {
            "username": db_user["username"],
            "email": db_user["email"],
            "_id": str(db_user["_id"])
        }
        
        user_id = str(db_user["_id"])
        token = create_access_token(user_id=user_id)
        
        return JSONResponse(status_code=200,content={"message": "Login successful", "data": user_data, settings.JWT_TOKEN_NAME: token})

    except Exception as e:
        print(f"An unexpected error occurred during login: {str(e)}")
        return JSONResponse(status_code=500,content={"message": "An unexpected error occurred"})
    
async def user_profile(user_id: str):
    try:
        db_user = users.find_one({"_id": ObjectId(user_id)})
        if not db_user:
            return JSONResponse(status_code=404, content={"message": "User not found", "data" : {"auth": False}})

        user_data = {
            "name": db_user["username"],
            "email": db_user["email"],
            "_id": str(db_user["_id"]),
            "auth": True
        }

        return JSONResponse(status_code=200, content={"message": "Profile fetched successfully", "data": user_data})

    except Exception as e:
        print(f"An unexpected error occurred while fetching profile: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "An unexpected error occurred", "data" : {"auth": False}})