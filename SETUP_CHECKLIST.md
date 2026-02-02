# Ready4Hire Firebase Auth - Setup Checklist

## Pre-Implementation Checklist

Before running the application, complete these steps:

### Firebase Setup (Required)

- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Project name: "Ready4Hire" (or your choice)
- [ ] Enable Google Analytics (optional)
- [ ] Create project

### Firebase Authentication Setup

- [ ] Go to **Authentication** section
- [ ] Click **Sign-in method**
- [ ] Enable **Email/Password** provider
- [ ] Enable **Google** provider
- [ ] Add authorized domains if needed (localhost is pre-authorized)

### Get Firebase Credentials

#### Web Credentials

- [ ] Go to **Project Settings** (⚙️ icon)
- [ ] Scroll to "Your apps" section
- [ ] Find your Web app config (or create if missing)
- [ ] Copy the config object containing:
  - `apiKey`
  - `authDomain`
  - `projectId`
  - `storageBucket`
  - `messagingSenderId`
  - `appId`

#### Service Account Credentials (for server)

- [ ] Go to **Project Settings** > **Service Accounts**
- [ ] Click **Generate New Private Key**
- [ ] This downloads a JSON file (keep this secure!)
- [ ] You'll need this for `server/.env`

---

## Environment Setup Checklist

### Frontend Configuration

**File**: `client/.env`

```env
# Get these from Firebase Web app config
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-name
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_BACKEND_URL=http://localhost:3000
```

Steps:

- [ ] Create `client/.env` file
- [ ] Copy each value from Firebase Console Web config
- [ ] Verify `VITE_BACKEND_URL` is `http://localhost:3000`

### Backend Configuration

**File**: `server/.env`

```env
PORT=3000
MONGO_LOCAL_URI=mongodb://127.0.0.1:27017/ready4hire
GROQ_API_KEY=your_groq_api_key
FIREBASE_ADMIN_SDK={"type":"service_account",...}
```

Steps (Choose Option A or B):

**Option A: Using Service Account JSON File**

1. [ ] Download service account key from Firebase
2. [ ] Save to `server/serviceAccountKey.json`
3. [ ] Add to `server/.gitignore`: `serviceAccountKey.json`
4. [ ] Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/serviceAccountKey.json"
   ```
5. [ ] Don't set `FIREBASE_ADMIN_SDK` in `.env`

**Option B: Using Environment Variable**

1. [ ] Download service account key JSON
2. [ ] Stringify and escape the JSON
3. [ ] Add to `server/.env`:
   ```env
   FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"your-project",...}
   ```

---

## Installation Checklist

### 1. Dependencies

- [ ] Frontend: `cd client && npm install`
- [ ] Backend: `cd server && npm install`

### 2. Database

- [ ] MongoDB running locally:

  ```bash
  # Windows
  mongod

  # Mac with Homebrew
  brew services start mongodb-community

  # Docker
  docker run -d -p 27017:27017 --name mongodb mongo
  ```

- [ ] Test connection: `mongosh` or `mongo` should work

### 3. Environment Variables

- [ ] `client/.env` - Firebase Web credentials filled
- [ ] `server/.env` - Firebase Admin SDK configured
- [ ] `server/serviceAccountKey.json` - (if using Option A)
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` - (if using Option A)

---

## Pre-Run Checklist

Before starting the dev servers:

- [ ] MongoDB is running
- [ ] `client/.env` has all VITE*FIREBASE*\* values
- [ ] `server/.env` has FIREBASE_ADMIN_SDK or serviceAccountKey.json
- [ ] Both `package.json` files have firebase/firebase-admin
- [ ] Port 3000 is available (backend)
- [ ] Port 5173 is available (frontend, or use `npm run dev` to get assigned port)

---

## Run Application Checklist

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

- [ ] See: `Server running on port 3000`
- [ ] See: `MongoDB Connected: localhost`
- [ ] No Firebase errors in console

### Terminal 2 - Frontend

```bash
cd client
npm run dev
```

- [ ] See: `Local: http://localhost:5173` (or similar)
- [ ] Browser automatically opens
- [ ] No Firebase errors in console

---

## Test Signup Flow Checklist

Navigate to http://localhost:5173/signup

### Step 1: User Info

- [ ] Enter Name: `Test User`
- [ ] Enter Email: `test@example.com`
- [ ] Click "Continue"
- [ ] Should show Step 2

### Step 2: Phone Number

- [ ] Enter Phone: `+11234567890` (test number from Firebase)
- [ ] Click "Send OTP"
- [ ] Should see "We've sent an OTP"
- [ ] Should show Step 3

### Step 3: OTP Verification

- [ ] Enter OTP: `123456` (test code from Firebase)
- [ ] Click "Verify & Create Account"
- [ ] Should redirect to `/resume` page
- [ ] Should see resume upload interface

### Verification

- [ ] Check MongoDB: `db.users.findOne()` should show new user with uid
- [ ] Check browser localStorage: idToken should be stored
- [ ] Browser console should show no auth errors

---

## Test Login Flow Checklist

Navigate to http://localhost:5173/login

### Step 1: Phone Number

- [ ] Enter Phone: `+11234567890`
- [ ] Click "Send OTP"
- [ ] Should see "We've sent an OTP"

### Step 2: OTP Verification

- [ ] Enter OTP: `123456`
- [ ] Click "Login"
- [ ] Should redirect to `/resume` page

---

## Test Protected Routes Checklist

- [ ] Logout and try accessing `/resume` directly
  - [ ] Should redirect to `/login`
- [ ] Logout and try accessing `/interview` directly
  - [ ] Should redirect to `/login`
- [ ] Login again and verify you can access protected pages

---

## API Testing Checklist

### Test Resume Upload (Protected)

- [ ] Login first
- [ ] Go to `/resume`
- [ ] Upload a PDF resume
- [ ] Backend should receive request with Authorization header
- [ ] MongoDB: Resume should have `userId` field matching your uid

### Test Interview (Protected)

- [ ] After uploading resume, go to `/interview`
- [ ] Click "Start Interview"
- [ ] Backend should receive request with Authorization header
- [ ] MongoDB: Interview should have `userId` field

---

## Troubleshooting Checklist

### Firebase Errors

- [ ] Verify all VITE*FIREBASE*\* env vars are correct
- [ ] Check Firebase Console Phone auth is enabled
- [ ] Verify test phone number exists in Firebase Console
- [ ] Check reCAPTCHA is properly loaded (might need network)

### Token Errors ("Invalid token")

- [ ] Verify `FIREBASE_ADMIN_SDK` is set correctly OR `serviceAccountKey.json` exists
- [ ] Check service account credentials are from correct Firebase project
- [ ] Verify token wasn't expired (refresh if needed)

### MongoDB Errors

- [ ] Check MongoDB is running: `mongosh` should connect
- [ ] Check `MONGO_LOCAL_URI` in `server/.env`
- [ ] Check database name is "ready4hire": `show databases`

### CORS Errors

- [ ] Backend `server.js` should have `app.use(cors())`
- [ ] Both frontend and backend should be running
- [ ] Backend URL in frontend `.env` should match running backend

### Port Already In Use

- [ ] Backend: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr 3000` (Windows)
- [ ] Frontend: Try different port - `npm run dev` will assign next available

---

## Development Tips

### Useful MongoDB Commands

```bash
# Connect to database
mongosh

# Show databases
show databases

# Use ready4hire database
use ready4hire

# View users
db.users.find()

# View a specific user
db.users.findOne()

# View resumes
db.resumes.find()

# Delete all test data (for fresh start)
db.users.deleteMany({})
db.resumes.deleteMany({})
db.interviewlogs.deleteMany({})
```

### Useful Firebase Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# List projects
firebase projects:list

# Select project
firebase use your-project-id
```

### Browser DevTools

- [ ] Check localStorage for `idToken`
- [ ] Network tab shows `Authorization: Bearer <token>` headers
- [ ] Console should have no Firebase auth errors

---

## Deployment Checklist

When ready to deploy (NOT YET):

- [ ] Change `VITE_BACKEND_URL` to production backend URL
- [ ] Update Firebase Console to allow production domain
- [ ] Set up Firebase Security Rules
- [ ] Enable Firebase Phone Auth rate limiting
- [ ] Use environment-specific Firebase projects
- [ ] Disable test phone numbers in production
- [ ] Switch from localStorage to secure cookie for token
- [ ] Enable HTTPS everywhere
- [ ] Set up monitoring/logging
- [ ] Test on real device

---

## Quick Reference

| Component        | Type     | Status     |
| ---------------- | -------- | ---------- |
| Firebase Config  | Frontend | ✅ Created |
| Auth Context     | Frontend | ✅ Created |
| Signup Page      | Frontend | ✅ Created |
| Login Page       | Frontend | ✅ Created |
| Protected Route  | Frontend | ✅ Created |
| User Model       | Backend  | ✅ Created |
| Auth Middleware  | Backend  | ✅ Created |
| User Routes      | Backend  | ✅ Created |
| App Routing      | Frontend | ✅ Updated |
| Resume Routes    | Backend  | ✅ Updated |
| Interview Routes | Backend  | ✅ Updated |

---

## Need Help?

1. Check `QUICK_START.md` for quick setup
2. Check `FIREBASE_AUTH_SETUP.md` for detailed setup
3. Check `IMPLEMENTATION_SUMMARY.md` for what was implemented
4. Check Firebase Console for auth status
5. Check browser console for JavaScript errors
6. Check server console for backend errors

---

**Status: Ready for Setup and Testing** ✅
