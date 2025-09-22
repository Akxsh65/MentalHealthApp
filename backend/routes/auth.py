from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from database import get_db
from models import User, Patient, Clinician
from schemas import UserCreate, UserLogin, Token, PatientCreate, ClinicianCreate
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["authentication"])

# Create nested request schemas to match frontend
class PatientRegistrationRequest(BaseModel):
    user_data: UserCreate
    patient_data: PatientCreate

class ClinicianRegistrationRequest(BaseModel):
    user_data: UserCreate
    clinician_data: ClinicianCreate

@router.post("/register/patient", response_model=Token)
async def register_patient(
    request: PatientRegistrationRequest,
    db: Session = Depends(get_db)
):
    # Extract data from nested request
    user_data = request.user_data
    patient_data = request.patient_data
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        user_type="patient"
    )
    db.add(db_user)
    db.flush()  # Get the user ID
    
    # Create patient profile
    db_patient = Patient(
        user_id=db_user.id,
        **patient_data.dict()
    )
    db.add(db_patient)
    
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": "patient",
        "user_id": db_user.id
    }

@router.post("/register/clinician", response_model=Token)
async def register_clinician(
    request: ClinicianRegistrationRequest,
    db: Session = Depends(get_db)
):
    # Extract data from nested request
    user_data = request.user_data
    clinician_data = request.clinician_data
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        user_type="clinician"
    )
    db.add(db_user)
    db.flush()  # Get the user ID
    
    # Create clinician profile
    db_clinician = Clinician(
        user_id=db_user.id,
        **clinician_data.dict()
    )
    db.add(db_clinician)
    
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": "clinician",
        "user_id": db_user.id
    }

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user.user_type,
        "user_id": user.id
    }
