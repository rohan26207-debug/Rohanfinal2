from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import asyncio


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# User Authentication Models
class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class SessionData(BaseModel):
    session_token: str
    user: User

# Petrol Pump Data Models
class FuelSale(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str  # ISO date string
    fuel_type: str
    nozzle_id: str
    opening_reading: float
    closing_reading: float
    liters: float
    rate: float
    amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreditSale(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str
    customer_name: str
    amount: float
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IncomeExpense(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str
    type: str  # "income" or "expense"
    category: str
    amount: float
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FuelRate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str
    fuel_type: str
    rate: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Authentication helper functions
async def get_session_token(request: Request) -> Optional[str]:
    """Extract session token from cookie or Authorization header"""
    # First check cookies (preferred)
    session_token = request.cookies.get("session_token")
    if session_token:
        return session_token
    
    # Fallback to Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]  # Remove "Bearer " prefix
    
    return None

async def get_current_user(request: Request) -> Optional[User]:
    """Get current authenticated user from session token"""
    session_token = await get_session_token(request)
    if not session_token:
        return None
    
    # Check if session exists and is valid
    session = await db.user_sessions.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })
    
    if not session:
        return None
    
    # Get user data
    user_doc = await db.users.find_one({"_id": session["user_id"]})
    if not user_doc:
        return None
    
    # Map _id to id for Pydantic compatibility
    user_doc["id"] = user_doc["_id"]
    del user_doc["_id"]  # Remove _id to avoid conflicts
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Dependency to require authentication"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


# Authentication routes
@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user info"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Process session_id from Google OAuth and create session"""
    try:
        # Get session_id from request header
        session_id = request.headers.get("X-Session-ID")
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        # Call Emergent auth service to get user data
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid session ID")
            
            session_data = auth_response.json()
        
        # Extract user info
        user_data = {
            "id": session_data["id"],
            "email": session_data["email"],
            "name": session_data["name"],
            "picture": session_data.get("picture"),
            "created_at": datetime.now(timezone.utc)
        }
        
        # Check if user exists, if not create new user
        existing_user = await db.users.find_one({"_id": user_data["id"]})
        if not existing_user:
            # Insert new user (use _id as MongoDB field)
            user_doc = user_data.copy()
            user_doc["_id"] = user_doc.pop("id")
            await db.users.insert_one(user_doc)
        
        # Create new session
        session_token = session_data["session_token"]
        session_doc = {
            "user_id": user_data["id"],
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc).replace(microsecond=0) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        
        # Clean up existing sessions for this user
        await db.user_sessions.delete_many({"user_id": user_data["id"]})
        
        # Insert new session
        await db.user_sessions.insert_one(session_doc)
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        # Return user data
        return {"user": user_data, "session_token": session_token}
        
    except Exception as e:
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Session creation failed")

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user and clear session"""
    session_token = await get_session_token(request)
    if session_token:
        # Delete session from database
        await db.user_sessions.delete_many({"session_token": session_token})
    
    # Clear cookie
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )
    
    return {"message": "Logged out successfully"}

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Petrol Pump Data Routes (Protected)
@api_router.get("/fuel-sales")
async def get_fuel_sales(request: Request, date: Optional[str] = None):
    """Get fuel sales for a specific date"""
    user = await require_auth(request)
    
    query = {"user_id": user.id}
    if date:
        query["date"] = date
    
    sales = await db.fuel_sales.find(query).to_list(1000)
    # Remove MongoDB _id field to avoid serialization issues
    for sale in sales:
        if "_id" in sale:
            del sale["_id"]
    return sales

@api_router.post("/fuel-sales")
async def create_fuel_sale(request: Request, sale_data: dict):
    """Create new fuel sale record"""
    user = await require_auth(request)
    
    sale = FuelSale(
        user_id=user.id,
        **sale_data
    )
    
    await db.fuel_sales.insert_one(sale.dict())
    return {"message": "Fuel sale created", "id": sale.id}

@api_router.get("/credit-sales")
async def get_credit_sales(request: Request, date: Optional[str] = None):
    """Get credit sales for a specific date"""
    user = await require_auth(request)
    
    query = {"user_id": user.id}
    if date:
        query["date"] = date
    
    sales = await db.credit_sales.find(query).to_list(1000)
    # Remove MongoDB _id field to avoid serialization issues
    for sale in sales:
        if "_id" in sale:
            del sale["_id"]
    return sales

@api_router.post("/credit-sales")
async def create_credit_sale(request: Request, sale_data: dict):
    """Create new credit sale record"""
    user = await require_auth(request)
    
    sale = CreditSale(
        user_id=user.id,
        **sale_data
    )
    
    await db.credit_sales.insert_one(sale.dict())
    return {"message": "Credit sale created", "id": sale.id}

@api_router.get("/income-expenses")
async def get_income_expenses(request: Request, date: Optional[str] = None):
    """Get income/expense records for a specific date"""
    user = await require_auth(request)
    
    query = {"user_id": user.id}
    if date:
        query["date"] = date
    
    records = await db.income_expenses.find(query).to_list(1000)
    # Remove MongoDB _id field to avoid serialization issues
    for record in records:
        if "_id" in record:
            del record["_id"]
    return records

@api_router.post("/income-expenses")
async def create_income_expense(request: Request, record_data: dict):
    """Create new income/expense record"""
    user = await require_auth(request)
    
    record = IncomeExpense(
        user_id=user.id,
        **record_data
    )
    
    await db.income_expenses.insert_one(record.dict())
    return {"message": "Income/expense record created", "id": record.id}

@api_router.get("/fuel-rates")
async def get_fuel_rates(request: Request, date: Optional[str] = None):
    """Get fuel rates for a specific date"""
    user = await require_auth(request)
    
    query = {"user_id": user.id}
    if date:
        query["date"] = date
    
    rates = await db.fuel_rates.find(query).to_list(1000)
    # Remove MongoDB _id field to avoid serialization issues
    for rate in rates:
        if "_id" in rate:
            del rate["_id"]
    return rates

@api_router.post("/fuel-rates")
async def create_fuel_rate(request: Request, rate_data: dict):
    """Create/update fuel rate record"""
    user = await require_auth(request)
    
    rate = FuelRate(
        user_id=user.id,
        **rate_data
    )
    
    await db.fuel_rates.insert_one(rate.dict())
    return {"message": "Fuel rate created", "id": rate.id}

# Sync endpoint for Gmail backup
@api_router.post("/sync/backup")
async def backup_data(request: Request):
    """Backup all user data for Gmail sync"""
    user = await require_auth(request)
    
    # Get all user data
    fuel_sales = await db.fuel_sales.find({"user_id": user.id}).to_list(1000)
    credit_sales = await db.credit_sales.find({"user_id": user.id}).to_list(1000)
    income_expenses = await db.income_expenses.find({"user_id": user.id}).to_list(1000)
    fuel_rates = await db.fuel_rates.find({"user_id": user.id}).to_list(1000)
    
    # Remove MongoDB _id fields to avoid serialization issues
    for collection in [fuel_sales, credit_sales, income_expenses, fuel_rates]:
        for item in collection:
            if "_id" in item:
                del item["_id"]
    
    backup_data = {
        "user": user.dict(),
        "fuel_sales": fuel_sales,
        "credit_sales": credit_sales,
        "income_expenses": income_expenses,
        "fuel_rates": fuel_rates,
        "backup_date": datetime.now(timezone.utc).isoformat()
    }
    
    return backup_data

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
