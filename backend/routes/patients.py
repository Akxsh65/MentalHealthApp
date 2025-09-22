from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Patient, MoodEntry, JournalEntry, QuestionnaireResponse
from schemas import (
    MoodEntryCreate, MoodEntry as MoodEntrySchema,
    JournalEntryCreate, JournalEntry as JournalEntrySchema,
    QuestionnaireResponseCreate, QuestionnaireResponse as QuestionnaireResponseSchema
)
from auth import get_current_patient

router = APIRouter(prefix="/patients", tags=["patients"])

# Mood tracking endpoints
@router.post("/mood", response_model=MoodEntrySchema)
async def create_mood_entry(
    mood_data: MoodEntryCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    db_mood = MoodEntry(
        patient_id=current_patient.id,
        **mood_data.dict()
    )
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood

@router.get("/mood", response_model=List[MoodEntrySchema])
async def get_mood_entries(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
    limit: int = 30
):
    mood_entries = db.query(MoodEntry)\
        .filter(MoodEntry.patient_id == current_patient.id)\
        .order_by(MoodEntry.timestamp.desc())\
        .limit(limit)\
        .all()
    return mood_entries

# Journal endpoints
@router.post("/journal", response_model=JournalEntrySchema)
async def create_journal_entry(
    journal_data: JournalEntryCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    db_journal = JournalEntry(
        patient_id=current_patient.id,
        **journal_data.dict()
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.get("/journal", response_model=List[JournalEntrySchema])
async def get_journal_entries(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
    limit: int = 50
):
    journal_entries = db.query(JournalEntry)\
        .filter(JournalEntry.patient_id == current_patient.id)\
        .order_by(JournalEntry.timestamp.desc())\
        .limit(limit)\
        .all()
    return journal_entries

@router.get("/journal/{entry_id}", response_model=JournalEntrySchema)
async def get_journal_entry(
    entry_id: int,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    journal_entry = db.query(JournalEntry)\
        .filter(
            JournalEntry.id == entry_id,
            JournalEntry.patient_id == current_patient.id
        )\
        .first()
    
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    return journal_entry

# Questionnaire endpoints
@router.post("/questionnaire", response_model=QuestionnaireResponseSchema)
async def submit_questionnaire(
    questionnaire_data: QuestionnaireResponseCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    db_questionnaire = QuestionnaireResponse(
        patient_id=current_patient.id,
        **questionnaire_data.dict()
    )
    db.add(db_questionnaire)
    db.commit()
    db.refresh(db_questionnaire)
    return db_questionnaire

@router.get("/questionnaire", response_model=List[QuestionnaireResponseSchema])
async def get_questionnaire_responses(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
    limit: int = 20
):
    responses = db.query(QuestionnaireResponse)\
        .filter(QuestionnaireResponse.patient_id == current_patient.id)\
        .order_by(QuestionnaireResponse.timestamp.desc())\
        .limit(limit)\
        .all()
    return responses

# Patient profile endpoint
@router.get("/profile")
async def get_patient_profile(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    return {
        "id": current_patient.id,
        "first_name": current_patient.first_name,
        "last_name": current_patient.last_name,
        "date_of_birth": current_patient.date_of_birth,
        "phone": current_patient.phone,
        "emergency_contact": current_patient.emergency_contact,
        "consent_share_chatbot": current_patient.consent_share_chatbot
    }

@router.put("/consent")
async def update_chatbot_consent(
    consent_data: dict,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    consent = consent_data.get("consent", False)
    current_patient.consent_share_chatbot = consent
    db.commit()
    return {"message": "Consent updated successfully"}
