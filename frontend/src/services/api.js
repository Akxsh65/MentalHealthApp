// API service for Mental Health App
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // Set auth token in localStorage
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    // Remove auth token
    removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // Get auth headers
    getAuthHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication endpoints
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        this.setAuthToken(response.access_token);
        return response;
    }

    async registerPatient(userData, patientData) {
        const response = await this.request('/auth/register/patient', {
            method: 'POST',
            body: JSON.stringify({
                user_data: userData,
                patient_data: patientData
            })
        });
        
        this.setAuthToken(response.access_token);
        return response;
    }

    async registerClinician(userData, clinicianData) {
        const response = await this.request('/auth/register/clinician', {
            method: 'POST',
            body: JSON.stringify({
                user_data: userData,
                clinician_data: clinicianData
            })
        });
        
        this.setAuthToken(response.access_token);
        return response;
    }

    // Patient endpoints
    async getPatientProfile() {
        return await this.request('/patients/profile');
    }

    async createMoodEntry(moodData) {
        return await this.request('/patients/mood', {
            method: 'POST',
            body: JSON.stringify(moodData)
        });
    }

    async getMoodEntries(limit = 30) {
        return await this.request(`/patients/mood?limit=${limit}`);
    }

    async createJournalEntry(journalData) {
        return await this.request('/patients/journal', {
            method: 'POST',
            body: JSON.stringify(journalData)
        });
    }

    async getJournalEntries(limit = 50) {
        return await this.request(`/patients/journal?limit=${limit}`);
    }

    async submitQuestionnaire(questionnaireData) {
        return await this.request('/patients/questionnaire', {
            method: 'POST',
            body: JSON.stringify(questionnaireData)
        });
    }

    async getQuestionnaireResponses(limit = 20) {
        return await this.request(`/patients/questionnaire?limit=${limit}`);
    }

    async updateChatbotConsent(consent) {
        return await this.request('/patients/consent', {
            method: 'PUT',
            body: JSON.stringify({ consent })
        });
    }

    // Chatbot endpoints
    async saveChatbotConversation(conversationData) {
        return await this.request('/chatbot/conversation', {
            method: 'POST',
            body: JSON.stringify(conversationData)
        });
    }

    async getChatbotConversations(limit = 20) {
        return await this.request(`/chatbot/conversations?limit=${limit}`);
    }

    // Clinician endpoints
    async getAllPatients() {
        return await this.request('/clinicians/patients');
    }

    async getPatientReport(patientId) {
        return await this.request(`/clinicians/patients/${patientId}/report`);
    }

    async getPatientMoodData(patientId, days = 30) {
        return await this.request(`/clinicians/patients/${patientId}/mood?days=${days}`);
    }

    async getPatientQuestionnaireData(patientId) {
        return await this.request(`/clinicians/patients/${patientId}/questionnaire`);
    }

    // Logout
    logout() {
        this.removeAuthToken();
        // Redirect to login or home page
        window.location.href = '/';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getAuthToken();
    }

    // Get user type from token (basic implementation)
    getUserType() {
        const token = this.getAuthToken();
        if (!token) return null;
        
        try {
            // Decode JWT token (basic implementation)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user_type;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
