from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.types import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    user_type = Column(String, nullable=False)  # "patient" or "clinician"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(String)
    phone = Column(String)
    emergency_contact = Column(String)
    consent_share_chatbot = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="patient")
    mood_entries = relationship("MoodEntry", back_populates="patient")
    journal_entries = relationship("JournalEntry", back_populates="patient")
    chatbot_conversations = relationship("ChatbotConversation", back_populates="patient")
    questionnaire_responses = relationship("QuestionnaireResponse", back_populates="patient")

class Clinician(Base):
    __tablename__ = "clinicians"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    specialization = Column(String)
    license_number = Column(String)
    
    # Relationships
    user = relationship("User", back_populates="clinician")

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1-5 scale (matching frontend)
    mood_label = Column(String)  # "Very Sad", "Sad", "Neutral", "Happy", "Very Happy"
    notes = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="mood_entries")

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    title = Column(String)
    content = Column(Text, nullable=False)
    mood_before = Column(Integer)  # 1-5 scale (matching mood tracker)
    mood_after = Column(Integer)   # 1-5 scale (matching mood tracker)
    tags = Column(JSON)  # Array of free text tags (matching frontend)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="journal_entries")

class ChatbotConversation(Base):
    __tablename__ = "chatbot_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    conversation_data = Column(JSON, nullable=False)  # Array of messages
    timestamp = Column(DateTime, default=datetime.utcnow)
    consent_shared = Column(Boolean, default=False)
    
    # Relationships
    patient = relationship("Patient", back_populates="chatbot_conversations")

class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    questionnaire_type = Column(String, nullable=False, default="Well-being Assessment")
    responses = Column(JSON, nullable=False)  # Array of question-answer pairs
    total_score = Column(Float, nullable=False)  # 0-40 scale (8 questions × 5 max each)
    severity_level = Column(String)  # Calculated from score
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="questionnaire_responses")

# Add back-references to User model
User.patient = relationship("Patient", back_populates="user", uselist=False)
User.clinician = relationship("Clinician", back_populates="user", uselist=False)
