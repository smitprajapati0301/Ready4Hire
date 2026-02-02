# Ready4Hire - Quick Start Guide

## Before You Start

You **MUST** have a Firebase project with Email/Password and Google Sign-In enabled. If you don't have one yet:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "Ready4Hire"
3. Enable **Email/Password** and **Google** authentication in the Sign-in method section

## Installation

### 1. Clone/Set up Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd server
npm install
```

### 2. Configure Firebase

#### Get Your Firebase Credentials

1. Go to Firebase Console > Project Settings (⚙️)
2. Scroll to "Your apps" > Web app config
3. Copy your config object

**For Frontend (`client/.env`):**

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

VITE_BACKEND_URL=http://localhost:3000

# Auth Methods: Email/Password, Google Sign-In
```

**For Backend (`server/.env`):**

Option A (Development - Using File):

```bash
# Get from Firebase Console > Project Settings > Service Accounts > Generate Private Key
# Save the JSON file to server/serviceAccountKey.json
# Then set in terminal (PowerShell):
$env:GOOGLE_APPLICATION_CREDENTIALS="$(Get-Location)\serviceAccountKey.json"
# Or in Mac/Linux:
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/serviceAccountKey.json"
```

Option B (Development - Using .env file - **RECOMMENDED**):

```env
# Step 1: Go to Firebase Console > Project Settings > Service Accounts
# Step 2: Click "Generate New Private Key" - this downloads a JSON file
# Step 3: Open the JSON file and copy the entire contents
# Step 4: Paste into server/.env as:

FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"your-project-id","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/..."}

# Step 5: Save the file and restart backend (npm run dev)
```

### 3. Start MongoDB

```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Expected: `Server running on port 3000`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

Expected: `Local: http://localhost:5173`

## Test the Auth Flow

### Signup

1. Go to http://localhost:5173/signup
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
3. Click "Sign Up"
4. Should redirect to `/resume` page

**OR Sign Up with Google:**

1. Click "Sign up with Google"
2. Select Google account
3. Should redirect to `/resume` page

### Login

1. Go to http://localhost:5173/login
2. Enter email: `test@example.com`
3. Enter password: `Test123!`
4. Click "Login"
5. Should redirect to `/resume` page

**OR Login with Google:**

1. Click "Login with Google"
2. Select Google account
3. Should redirect to `/resume` page

### Upload Resume

1. After auth, go to Resume page
2. Upload a PDF resume
3. View ATS score and suggestions
4. Click "Start Mock Interview"

### Interview

1. Go to Interview page
2. Select voice mode or text mode
3. Answer interview questions
4. Get feedback after 8 questions

## Project Structure

```
Ready4Hire/
├── client/
│   ├── src/
│   │   ├── config/firebase.js              ← Firebase setup
│   │   ├── context/AuthContext.jsx         ← Auth state
│   │   ├── components/ProtectedRoute.jsx   ← Route protection
│   │   ├── pages/
│   │   │   ├── Signup.jsx                  ← Email/Password + Google signup
│   │   │   ├── Login.jsx                   ← Email/Password + Google login
│   │   │   ├── Resume.jsx                  ← Resume upload
│   │   │   └── Interview.jsx               ← Interview with voice
│   │   └── App.jsx                         ← Routing with auth
│   └── .env                                ← Firebase credentials
├── server/
│   ├── models/
│   │   ├── User.js                         ← User with uid
│   │   ├── Resume.js                       ← Resume with userId
│   │   └── InterviewLog.js                 ← Interview with userId
│   ├── middlewares/
│   │   └── auth.js                         ← Firebase token verification
│   ├── routes/
│   │   ├── userRoutes.js                   ← User creation & profile
│   │   ├── resumeRoutes.js                 ← Resume upload with auth
│   │   └── InterviewRoutes.js              ← Interview with auth
│   └── .env                                ← Firebase Admin SDK
└── docs/                                   ← Guides & references
```

## Common Issues

### "Firebase config not found"

- Ensure `client/.env` exists with all `VITE_FIREBASE_*` variables
- Restart Vite dev server after creating `.env`

### "401 Unauthorized" on backend requests

- Check that Firebase Admin SDK is configured in `server/.env`
- Verify token is being sent in Authorization header

### "User not found" after login

- User must sign up first before logging in
- Check MongoDB is running and accessible

### Google Sign-In not working

- Ensure Google provider is enabled in Firebase Console
- Check authorized domains include `localhost`

## Next Steps

✅ Authentication working  
✅ Upload resume to test ATS scoring  
✅ Try voice-based mock interview  
✅ Check MongoDB for user/resume/interview data

For detailed setup instructions, see:

- [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) - Complete Firebase setup guide
- [AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md) - Authentication implementation details
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Step-by-step checklist
