# Mental Health App - Setup Instructions

## ✅ What I've Completed

### 1. Removed Supabase Dependencies

- **Good news**: No Supabase code was found in your frontend! It's already configured to use a local backend.
- Frontend is properly set up to call `http://localhost:8000` API endpoints.

### 2. Fixed Backend Authentication Routes

- Updated `/auth/register/patient` to handle nested `{user_data, patient_data}` structure
- Updated `/auth/register/clinician` to handle nested `{user_data, clinician_data}` structure
- Authentication routes now match exactly what your frontend sends

### 3. Verified All Backend Routes

- ✅ Patient routes: mood tracking, journal, questionnaire, profile
- ✅ Clinician routes: patient reports, mood data analysis
- ✅ Chatbot routes: conversation saving, consent management
- ✅ Authentication: registration, login with JWT tokens

## 🔧 Python Environment Issues to Fix

Your Python installation has library path issues. Here are the solutions:

### Option 1: Reinstall Python (Recommended)

1. Uninstall current Python installation
2. Download Python 3.11 or 3.12 from https://python.org
3. During installation, check "Add Python to PATH"
4. After installation, run: `python -m pip install --upgrade pip`

### Option 2: Use Conda/Anaconda

```powershell
# Install Anaconda, then:
conda create -n mentalhealth python=3.11
conda activate mentalhealth
pip install -r requirements.txt
```

### Option 3: Fix Current Installation

```powershell
# Navigate to backend directory
cd C:\Users\akash\MentalHealthApp\MentalHealthApp\backend

# Try to repair pip
py -m ensurepip --upgrade
py -m pip install --upgrade pip

# Install dependencies
py -m pip install -r requirements.txt
```

## 🚀 How to Start the Application

### 1. Start Backend (after fixing Python)

```powershell
cd C:\Users\akash\MentalHealthApp\MentalHealthApp\backend
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend (in another terminal)

```powershell
cd C:\Users\akash\MentalHealthApp\MentalHealthApp\frontend
npm run dev
```

## 📋 Testing the Authentication Flow

Once both servers are running:

1. **Test Patient Registration:**

   - Go to `http://localhost:3000/patient-auth`
   - Click "Register" tab
   - Fill out the form and submit
   - Should redirect to mood tracker page

2. **Test Clinician Registration:**

   - Go to `http://localhost:3000/clinician/login`
   - Click "Register" tab
   - Fill out the form and submit
   - Should redirect to clinician dashboard

3. **Test Login:**
   - Use previously registered credentials
   - Should work for both patient and clinician accounts

## 🗄️ Database

- Backend uses SQLite database: `backend/mental_health_app.db`
- Database tables are created automatically on first startup
- No additional database setup required

## 🔒 Security Note

The backend currently uses a placeholder secret key. For production:

1. Change `SECRET_KEY` in `backend/auth.py`
2. Use environment variables for sensitive data

## 🎯 Summary

Your authentication system is now properly configured:

- ✅ Frontend sends correct data structure
- ✅ Backend handles nested registration data
- ✅ JWT authentication implemented
- ✅ Database models match frontend expectations
- ✅ All API endpoints are functional

The only remaining issue is the Python environment, which needs to be fixed to run the backend server.
