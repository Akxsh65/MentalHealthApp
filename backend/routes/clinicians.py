from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Clinician, Patient, MoodEntry, JournalEntry, QuestionnaireResponse, ChatbotConversation
from schemas import PatientReport
from auth import get_current_clinician

router = APIRouter(prefix="/clinicians", tags=["clinicians"])

@router.get("/patients", response_model=List[dict])
async def get_all_patients(
    current_clinician: Clinician = Depends(get_current_clinician),
    db: Session = Depends(get_db)
):
    """Get list of all patients"""
    patients = db.query(Patient).all()
    return [
        {
            "id": patient.id,
            "name": f"{patient.first_name} {patient.last_name}",
            "email": patient.user.email,
            "consent_share_chatbot": patient.consent_share_chatbot
        }
        for patient in patients
    ]

@router.get("/patients/{patient_id}/report", response_model=PatientReport)
async def get_patient_report(
    patient_id: int,
    current_clinician: Clinician = Depends(get_current_clinician),
    db: Session = Depends(get_db)
):
    """Get comprehensive report for a specific patient"""
    # Get patient
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    # Get mood trends (last 30 entries)
    mood_entries = db.query(MoodEntry)\
        .filter(MoodEntry.patient_id == patient_id)\
        .order_by(MoodEntry.timestamp.desc())\
        .limit(30)\
        .all()
    
    mood_trends = [
        {
            "date": entry.timestamp.strftime("%Y-%m-%d"),
            "score": entry.mood_score,
            "label": entry.mood_label,
            "notes": entry.notes
        }
        for entry in mood_entries
    ]
    
    # Get journal summary (last 20 entries)
    journal_entries = db.query(JournalEntry)\
        .filter(JournalEntry.patient_id == patient_id)\
        .order_by(JournalEntry.timestamp.desc())\
        .limit(20)\
        .all()
    
    journal_summary = [
        {
            "date": entry.timestamp.strftime("%Y-%m-%d"),
            "title": entry.title,
            "content_preview": entry.content[:100] + "..." if len(entry.content) > 100 else entry.content,
            "mood_before": entry.mood_before,
            "mood_after": entry.mood_after,
            "tags": entry.tags
        }
        for entry in journal_entries
    ]
    
    # Get questionnaire scores (last 10 responses)
    questionnaire_responses = db.query(QuestionnaireResponse)\
        .filter(QuestionnaireResponse.patient_id == patient_id)\
        .order_by(QuestionnaireResponse.timestamp.desc())\
        .limit(10)\
        .all()
    
    questionnaire_scores = [
        {
            "date": response.timestamp.strftime("%Y-%m-%d"),
            "type": response.questionnaire_type,
            "score": response.total_score,
            "severity": response.severity_level
        }
        for response in questionnaire_responses
    ]
    
    # Get chatbot insights (if consent given)
    chatbot_insights = None
    if patient.consent_share_chatbot:
        chatbot_conversations = db.query(ChatbotConversation)\
            .filter(
                ChatbotConversation.patient_id == patient_id,
                ChatbotConversation.consent_shared == True
            )\
            .order_by(ChatbotConversation.timestamp.desc())\
            .limit(10)\
            .all()
        
        chatbot_insights = [
            {
                "date": conv.timestamp.strftime("%Y-%m-%d"),
                "message_count": len(conv.conversation_data),
                "conversation_preview": str(conv.conversation_data[:2])  # First 2 messages
            }
            for conv in chatbot_conversations
        ]
    
    # Calculate overall assessment
    overall_assessment = calculate_overall_assessment(
        mood_trends, questionnaire_scores
    )
    
    return PatientReport(
        patient_id=patient.id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        mood_trends=mood_trends,
        journal_summary=journal_summary,
        questionnaire_scores=questionnaire_scores,
        chatbot_insights=chatbot_insights,
        overall_assessment=overall_assessment
    )

@router.get("/patients/{patient_id}/mood")
async def get_patient_mood_data(
    patient_id: int,
    current_clinician: Clinician = Depends(get_current_clinician),
    db: Session = Depends(get_db),
    days: int = 30
):
    """Get patient mood data for trend analysis"""
    from datetime import datetime, timedelta
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    mood_entries = db.query(MoodEntry)\
        .filter(
            MoodEntry.patient_id == patient_id,
            MoodEntry.timestamp >= cutoff_date
        )\
        .order_by(MoodEntry.timestamp.asc())\
        .all()
    
    return [
        {
            "date": entry.timestamp.strftime("%Y-%m-%d"),
            "score": entry.mood_score,
            "label": entry.mood_label
        }
        for entry in mood_entries
    ]

@router.get("/patients/{patient_id}/questionnaire")
async def get_patient_questionnaire_data(
    patient_id: int,
    current_clinician: Clinician = Depends(get_current_clinician),
    db: Session = Depends(get_db)
):
    """Get patient questionnaire data for analysis"""
    responses = db.query(QuestionnaireResponse)\
        .filter(QuestionnaireResponse.patient_id == patient_id)\
        .order_by(QuestionnaireResponse.timestamp.desc())\
        .all()
    
    return [
        {
            "date": response.timestamp.strftime("%Y-%m-%d"),
            "type": response.questionnaire_type,
            "score": response.total_score,
            "severity": response.severity_level,
            "responses": response.responses
        }
        for response in responses
    ]

def calculate_overall_assessment(mood_trends, questionnaire_scores):
    """Calculate overall mental health assessment based on data - EXACTLY matching frontend"""
    if not mood_trends and not questionnaire_scores:
        return "Insufficient data for assessment"
    
    # Analyze mood trends (1-5 scale from frontend)
    mood_scores = [entry["score"] for entry in mood_trends if "score" in entry]
    avg_mood = sum(mood_scores) / len(mood_scores) if mood_scores else 3
    
    # Analyze questionnaire scores (0-40 scale from frontend, 8 questions × 5 max each)
    recent_scores = [score["score"] for score in questionnaire_scores[:3] if "score" in score]
    avg_questionnaire = sum(recent_scores) / len(recent_scores) if recent_scores else 20
    
    # Determine assessment based on frontend scoring
    if avg_mood >= 4 and avg_questionnaire >= 30:
        return "Excellent well-being! Keep up the great work maintaining your mental health."
    elif avg_mood >= 3.5 and avg_questionnaire >= 20:
        return "Good well-being. You're doing well, but there's always room for self-care!"
    elif avg_mood >= 3 and avg_questionnaire >= 15:
        return "Moderate well-being. Consider taking steps to improve your mood and energy."
    elif avg_mood >= 2 and avg_questionnaire >= 10:
        return "Low well-being. It might help to talk to someone you trust or a mental health professional."
    else:
        return "Critical well-being. Immediate professional attention is recommended."
