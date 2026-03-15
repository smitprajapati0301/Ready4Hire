# 🚀 Ready4Hire
### AI Resume Analyzer & Mock Interview Platform

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![Groq](https://img.shields.io/badge/AI-Groq%20LLM-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

Ready4Hire is an AI-powered platform that helps students and job seekers improve their resumes and prepare for interviews using AI-driven analysis and mock interviews.

---

# 🌐 Live Demo

**Website:** [https://your-live-url.com ](https://ready4hire-app.vercel.app/) 

**Repository:** [https://github.com/yourusername/ready4hire](https://github.com/smitprajapati0301/Ready4Hire)

---

# ✨ Features

- AI-powered Resume Analysis
- ATS Score Generation
- Resume Improvement Suggestions
- AI Mock Interviews
- Interview Feedback
- Secure Authentication
- Personal Dashboard

---

# ⚙️ Workflow

```
User Login
     │
     ▼
Upload Resume (PDF)
     │
     ▼
Resume Text Extraction
     │
     ▼
AI Resume Analysis
     │
     ▼
ATS Score + Suggestions
     │
     ▼
Start Mock Interview
     │
     ▼
AI Evaluates Answers
     │
     ▼
Feedback & Insights
     │
     ▼
Results Stored in Dashboard
```

---

# 🏗 System Architecture

```
             ┌───────────────┐
             │   Frontend    │
             │ React + Vite  │
             └───────┬───────┘
                     │ API Requests
                     ▼
             ┌───────────────┐
             │   Backend     │
             │ Node + Express│
             └───────┬───────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   MongoDB Atlas   Groq AI     Firebase
     Database       LLM       Authentication
```

---

# 🛠 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- Multer

**Database**
- MongoDB Atlas

**AI**
- Groq API

**Authentication**
- Firebase Authentication

**Deployment**
- Vercel
- Render

---

# 📂 Project Structure

```
Ready4Hire
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── server
│   ├── routes
│   ├── models
│   ├── middlewares
│   ├── config
│   └── server.js
│
└── README.md
```

---

# 📡 API Documentation

### Upload Resume

POST
```
/api/resume/upload
```

Form Data

```
resume: PDF file
```

Response Example

```json
{
  "name": "John Doe",
  "skills": ["React", "Node.js"],
  "atsScore": 82,
  "suggestions": ["Add more project details"]
}
```

---

### Get User Resumes

GET
```
/api/resume/user
```

Response Example

```json
[
  {
    "name": "John Doe",
    "atsScore": 82,
    "createdAt": "2026-03-12"
  }
]
```

---

# ⚡ Installation

Clone the repository

```
git clone https://github.com/yourusername/ready4hire.git
```

---

## Backend Setup

```
cd server
npm install
```

Create `.env`

```
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
FIREBASE_ADMIN_SDK=your_firebase_config
```

Run backend

```
npm start
```

---

## Frontend Setup

```
cd client
npm install
npm run dev
```

Create `.env`

```
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
```

---

# 🚀 Deployment

Frontend → Vercel  
Backend → Render  
Database → MongoDB Atlas

---

# 👨‍💻 Authors

**Smit Prajapati**  
https://github.com/smitprajapati0301

**Om Patel**
https://github.com/OMPATEL122006
---

# ⭐ Support

If you like this project, consider **starring the repository** ⭐
and sharing feedback.
