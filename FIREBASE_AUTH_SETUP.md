# Ready4Hire Authentication Setup Guide

## Overview

This document explains how to set up Firebase Email/Password and Google Sign-In authentication for Ready4Hire.

## Architecture

```
Frontend (React)                Backend (Node.js)              Firebase
├── Signup/Login Pages   ------>  User Routes         ------>  Auth
├── Firebase Auth SDK           POST /api/users/create          (Email/Password + Google)
├── Auth Context                GET /api/users/:uid
└── Protected Routes            Verify Token
                                (middleware)
                                ↓
                              MongoDB
                              (User data)
```

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project" or use existing one
3. Name it "Ready4Hire" (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Email/Password and Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Email/Password** and enable it
3. Click **Google** and enable it
4. Add authorized domains if needed (localhost is pre-authorized)
5. Save

### 3. Get Firebase Credentials

#### Client-Side Credentials

1. In Firebase Console, go to **Project Settings** (⚙️)
2. Scroll to "Your apps" section
3. Click **Web** (or create if not present)
4. Copy the config object:

```javascript
{
  "apiKey": "AIzaSy...",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123..."
}
```

5. Create or update `client/.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

VITE_BACKEND_URL=http://localhost:3000
```

#### Server-Side Credentials (Firebase Admin SDK)

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. This downloads a JSON file like:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

4. **Option A**: Save to `server/serviceAccountKey.json` and add to `.gitignore`:

```bash
# In server directory
echo "serviceAccountKey.json" >> .gitignore
# Paste the JSON content into server/serviceAccountKey.json
```

Then set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/serviceAccountKey.json"
```

5. **Option B**: Store as environment variable (for production):

```env
# server/.env
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"...","private_key":"..."}
```

### 4. Install Dependencies

**Frontend:**

```bash
cd client
npm install
```

**Backend:**

```bash
cd server
npm install
```

### 5. Database Setup

Make sure MongoDB is running:

```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 6. Run Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Should see: `Server running on port 3000`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

Should see: `Local: http://localhost:5173`

### 7. Test the Flow

1. Go to http://localhost:5173
2. Click "Sign up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
4. Click Continue
5. Enter phone: **+11234567890** (test number from Firebase Console)
6. Click "Send OTP"
7. Enter OTP: **123456** (test code from Firebase Console)
8. Click "Verify & Create Account"

Should redirect to Resume page.

## Architecture Overview

### Frontend Flow

```
Landing/Home
    ↓
   [Signup/Login]
    ↓
[Firebase Phone OTP]
    ↓
[Backend: Create/Fetch User]
    ↓
[Protected Routes: Resume, Interview]
```

### Data Models

**Firebase (Auth Only)**

- uid (unique identifier)
- phoneNumber
- email (optional)

**MongoDB - User**

```javascript
{
  uid: "firebase_uid",      // Primary identity
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  createdAt: Date,
  updatedAt: Date
}
```

**MongoDB - Resume**

```javascript
{
  userId: "firebase_uid",   // Links to User
  name: "John Doe",
  email: "john@example.com",
  skills: ["React", "Node.js"],
  projects: [...],
  education: [...],
  experience: [...],
  atsScore: 75,
  missing: ["Portfolio Link"],
  suggestions: ["Add GitHub URL"],
  rawText: "...",
  createdAt: Date,
  updatedAt: Date
}
```

**MongoDB - InterviewLog**

```javascript
{
  userId: "firebase_uid",   // Links to User
  resumeId: ObjectId,       // Links to Resume
  domain: "Web Development",
  questions: ["What is React?"],
  answers: ["A JavaScript library"],
  feedback: "Good answer...",
  createdAt: Date,
  updatedAt: Date
}
```

### Security

1. **Frontend**: Only Firebase SDK handles passwords/OTP
2. **Backend**: Verifies Firebase ID token on every request
3. **Database**: All queries filtered by `userId` (Firebase UID)
4. **No Passwords**: Phone OTP only

## Troubleshooting

### "Invalid or expired token" error

- Token expired: Frontend needs to refresh before making request
- Firebase credentials wrong: Check VITE\_\* vars in client/.env
- Server credentials wrong: Check FIREBASE_ADMIN_SDK in server/.env

### "User not found" on login

- User never signed up
- User is in different Firebase project
- Check MongoDB for document with matching uid

### OTP not sending

- Test phone number not added to Firebase Console
- Firebase billing enabled (might block development)
- Phone format wrong (should be +1234567890)

### CORS errors

- Backend CORS config includes frontend URL
- Default allows http://localhost:5173 and http://localhost:3000

## Next Steps

1. Add email/SMS verification for production
2. Set up Firebase Security Rules
3. Enable Multi-factor authentication
4. Add role-based access control
5. Implement refresh token rotation

## Files Changed

### Frontend

- `src/config/firebase.js` - Firebase initialization
- `src/context/AuthContext.jsx` - Auth state management
- `src/pages/Signup.jsx` - Signup flow
- `src/pages/Login.jsx` - Login flow
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/App.jsx` - Routing with auth
- `.env` - Firebase credentials
- `package.json` - Added firebase

### Backend

- `models/User.js` - New user model
- `models/Resume.js` - Added userId field
- `models/InterviewLog.js` - Added userId field
- `middlewares/auth.js` - Token verification
- `routes/userRoutes.js` - New user endpoints
- `routes/resumeRoutes.js` - Updated to use userId
- `routes/InterviewRoutes.js` - Updated to use userId
- `server.js` - Added auth middleware
- `.env` - Firebase Admin SDK setup
- `package.json` - Added firebase-admin

## Production Checklist

- [ ] Firebase project in production mode
- [ ] Enable phone number auth provider restrictions
- [ ] Set up reCAPTCHA v3 (not invisible)
- [ ] Use environment-specific Firebase projects
- [ ] Enable Firebase Security Rules
- [ ] Set up HTTPS for production
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up monitoring/logging
- [ ] Test on real device (not just development)
