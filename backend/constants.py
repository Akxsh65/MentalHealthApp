# Constants that EXACTLY match the frontend UI options
# This ensures seamless integration between frontend and backend

# Mood Tracker Constants (matching frontend exactly)
MOOD_SCALE = {
    1: "Very Sad",
    2: "Sad", 
    3: "Neutral",
    4: "Happy",
    5: "Very Happy"
}

MOOD_EMOJIS = {
    1: "😢",  # Very Sad
    2: "😔",  # Sad
    3: "😐",  # Neutral
    4: "😊",  # Happy
    5: "😄"   # Very Happy
}

# Questionnaire Constants (matching frontend exactly)
QUESTIONNAIRE_SCALE = {
    0: "At no time",
    1: "Some of the time",
    2: "Less than half the time",
    3: "More than half the time",
    4: "Most of the time",
    5: "All of the time"
}

# Frontend Questions (matching exactly)
WELLBEING_QUESTIONS = [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me",
    "I have felt connected to people around me",
    "I have enjoyed learning or trying something new",
    "I have felt proud of something I accomplished"
]

# Scoring Constants (matching frontend exactly)
MAX_QUESTIONNAIRE_SCORE = 40  # 8 questions × 5 max each
MIN_QUESTIONNAIRE_SCORE = 0

# Assessment Thresholds (matching frontend feedback exactly)
ASSESSMENT_THRESHOLDS = {
    "excellent": {"min_score": 35, "message": "Excellent well-being! Keep up the great work maintaining your mental health."},
    "good": {"min_score": 25, "message": "Good well-being. You're doing well, but there's always room for self-care!"},
    "moderate": {"min_score": 15, "message": "Moderate well-being. Consider taking steps to improve your mood and energy."},
    "low": {"min_score": 0, "message": "Low well-being. It might help to talk to someone you trust or a mental health professional."}
}

# Badge Logic (matching frontend exactly)
BADGE_CRITERIA = {
    "7_moods": {"requirement": 7, "label": "7 Moods Logged", "icon": "🏆"},
    "3_day_streak": {"requirement": 3, "label": "3-Day Streak", "icon": "🔥"},
    "7_day_streak": {"requirement": 7, "label": "7-Day Streak", "icon": "⭐"},
    "first_entry": {"requirement": 1, "label": "First Entry", "icon": "🎯"},
    "10_entries": {"requirement": 10, "label": "10 Entries", "icon": "📚"}
}

# Journal Constants
WORD_GOAL = 50  # Matching frontend word count goal

# Motivational Quotes (matching frontend exactly)
MOTIVATIONAL_QUOTES = [
    "Every day is a fresh start.",
    "Small steps every day.",
    "Your feelings are valid.",
    "Progress, not perfection.",
    "You are stronger than you think."
]
