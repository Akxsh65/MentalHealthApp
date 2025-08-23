from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums to match frontend exactly
class MoodScale(str, Enum):
    VERY_SAD = "1"
    SAD = "2" 
    NEUTRAL = "3"
    HAPPY = "4"
    VERY_HAPPY = "5"

class MoodLabel(str, Enum):
    VERY_SAD = "Very Sad"
    SAD = "Sad"
    NEUTRAL = "Neutral"
    HAPPY = "Happy"
    VERY_HAPPY = "Very Happy"

class QuestionnaireScale(str, Enum):
    AT_NO_TIME = "0"
    SOME_OF_TIME = "1"
    LESS_THAN_HALF = "2"
    MORE_THAN_HALF = "3"
    MOST_OF_TIME = "4"
    ALL_OF_TIME = "5"

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    user_type: str  # "patient" or "clinician"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    user_type: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Patient schemas
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    consent_share_chatbot: bool = False

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    user_id: int
    user: User

    class Config:
        from_attributes = True

# Clinician schemas
class ClinicianBase(BaseModel):
    first_name: str
    last_name: str
    specialization: Optional[str] = None
    license_number: Optional[str] = None

class ClinicianCreate(ClinicianBase):
    pass

class Clinician(ClinicianBase):
    id: int
    user_id: int
    user: User

    class Config:
        from_attributes = True

# Mood tracking schemas - EXACTLY matching frontend
class MoodEntryBase(BaseModel):
    mood_score: int  # 1-5 scale (matching frontend)
    mood_label: Optional[MoodLabel] = None  # Predefined labels from frontend
    notes: Optional[str] = None

class MoodEntryCreate(MoodEntryBase):
    pass

class MoodEntry(MoodEntryBase):
    id: int
    patient_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Journal schemas - EXACTLY matching frontend
class JournalEntryBase(BaseModel):
    title: Optional[str] = None
    content: str
    mood_before: Optional[int] = None  # 1-5 scale (matching mood tracker)
    mood_after: Optional[int] = None   # 1-5 scale (matching mood tracker)
    tags: Optional[List[str]] = []  # Free text tags (matching frontend)

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntry(JournalEntryBase):
    id: int
    patient_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Chatbot conversation schemas
class ChatbotConversationBase(BaseModel):
    conversation_data: List[Dict[str, Any]]
    consent_shared: bool = False

class ChatbotConversationCreate(ChatbotConversationBase):
    pass

class ChatbotConversation(ChatbotConversationBase):
    id: int
    patient_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Questionnaire schemas - EXACTLY matching frontend
class QuestionnaireResponseBase(BaseModel):
    questionnaire_type: str = "Well-being Assessment"  # Default to match frontend
    responses: List[Dict[str, Any]]  # Array of question-answer pairs
    total_score: float  # 0-40 scale (8 questions × 5 max each)
    severity_level: Optional[str] = None  # Calculated from score

class QuestionnaireResponseCreate(QuestionnaireResponseBase):
    pass

class QuestionnaireResponse(QuestionnaireResponseBase):
    id: int
    patient_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    user_id: int

class TokenData(BaseModel):
    email: Optional[str] = None

# Report schemas
class PatientReport(BaseModel):
    patient_id: int
    patient_name: str
    mood_trends: List[Dict[str, Any]]
    journal_summary: List[Dict[str, Any]]
    questionnaire_scores: List[Dict[str, Any]]
    chatbot_insights: Optional[List[Dict[str, Any]]] = None
    overall_assessment: str

# Response schemas
class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    detail: str
