from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Patient, ChatbotConversation
from schemas import ChatbotConversationCreate, ChatbotConversation as ChatbotConversationSchema
from auth import get_current_patient

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/conversation", response_model=ChatbotConversationSchema)
async def save_conversation(
    conversation_data: ChatbotConversationCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """Save a chatbot conversation"""
    db_conversation = ChatbotConversation(
        patient_id=current_patient.id,
        **conversation_data.dict()
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.get("/conversations", response_model=List[ChatbotConversationSchema])
async def get_conversations(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
    limit: int = 20
):
    """Get patient's chatbot conversations"""
    conversations = db.query(ChatbotConversation)\
        .filter(ChatbotConversation.patient_id == current_patient.id)\
        .order_by(ChatbotConversation.timestamp.desc())\
        .limit(limit)\
        .all()
    return conversations

@router.put("/conversation/{conversation_id}/consent")
async def update_conversation_consent(
    conversation_id: int,
    consent: bool,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """Update consent for sharing a specific conversation"""
    conversation = db.query(ChatbotConversation)\
        .filter(
            ChatbotConversation.id == conversation_id,
            ChatbotConversation.patient_id == current_patient.id
        )\
        .first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    conversation.consent_shared = consent
    db.commit()
    
    return {"message": "Consent updated successfully"}

@router.delete("/conversation/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """Delete a chatbot conversation"""
    conversation = db.query(ChatbotConversation)\
        .filter(
            ChatbotConversation.id == conversation_id,
            ChatbotConversation.patient_id == current_patient.id
        )\
        .first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}
