# Ready4Hire Authentication Migration: Phone OTP → Email/Password + Google

## Overview

The authentication system has been **migrated from Phone OTP to Email/Password with Google Sign-In** to avoid the 10 OTP per day limitation.

### What Changed

| Feature      | Old                     | New                     |
| ------------ | ----------------------- | ----------------------- |
| Primary Auth | Firebase Phone OTP      | Firebase Email/Password |
| Limit        | 10 OTPs/day             | Unlimited               |
| Social Login | None                    | Google Sign-In          |
| User Data    | uid, name, email, phone | uid, name, email        |

---

## New Authentication Flow

### Signup Flow

```
User enters Name, Email, Password
         ↓
Firebase: createUserWithEmailAndPassword()
         ↓
updateProfile() with name
         ↓
Get Firebase idToken
         ↓
POST /api/users/create in MongoDB
         ↓
Redirect to /resume
```

### Google Sign-In Flow

```
Click "Google" button
         ↓
Firebase: signInWithPopup(GoogleAuthProvider)
         ↓
Firebase returns user + idToken
         ↓
Try to find user in MongoDB
         ↓
Create if first login, or redirect to /resume
```

### Login Flow

```
User enters Email, Password
         ↓
Firebase: signInWithEmailAndPassword()
         ↓
Get Firebase idToken
         ↓
GET /api/users/:uid (verify user exists)
         ↓
Redirect to /resume
```

---

## Files Modified

### Frontend

1. **`client/src/pages/Signup.jsx`** - REPLACED
   - Removed: Phone input, OTP flow, RecaptchaVerifier
   - Added: Password + Confirm Password fields
   - Added: Google Sign-In button
   - Now using `createUserWithEmailAndPassword` and `signInWithPopup`

2. **`client/src/pages/Login.jsx`** - REPLACED
   - Removed: Phone input, OTP flow, RecaptchaVerifier
   - Added: Password field
   - Added: Google Sign-In button
   - Now using `signInWithEmailAndPassword` and `signInWithPopup`

3. **`client/src/context/AuthContext.jsx`** - UPDATED
   - Removed: Phone-related fallback user creation
   - Now: Only user from MongoDB is used

4. **`client/.env`** & **`client/.env.example`** - UPDATED
   - Added comment about auth methods

### Backend

1. **`server/models/User.js`** - UPDATED
   - Removed: `phone` field (no longer needed)
   - Kept: uid, name, email

2. **`server/.env`** - UPDATED
   - Added comment about auth methods

---

## Password Requirements

- **Minimum length**: 6 characters
- **No special requirements**: Firebase handles password validation
- **User confirmation**: Confirm Password field on signup

---

## Error Handling

### Signup Errors

| Error                 | Message                                  |
| --------------------- | ---------------------------------------- |
| Missing fields        | "Please fill in all fields"              |
| Passwords don't match | "Passwords do not match"                 |
| Password < 6 chars    | "Password must be at least 6 characters" |
| Email already used    | "Email already in use"                   |
| Invalid email         | "Invalid email address"                  |
| Weak password         | "Password is too weak"                   |

### Login Errors

| Error           | Message                                  |
| --------------- | ---------------------------------------- |
| Missing fields  | "Please fill in all fields"              |
| Email not found | "Email not found. Please sign up first." |
| Wrong password  | "Incorrect password"                     |
| Invalid email   | "Invalid email address"                  |

### Google Sign-In Errors

| Error         | Message                                 |
| ------------- | --------------------------------------- |
| Not signed up | "User not found. Please sign up first." |
| Other errors  | Firebase error message                  |

---

## Firebase Configuration Changes Required

### Enable Email/Password Auth

1. Go to **Firebase Console** > **Authentication**
2. Click **Sign-in method**
3. Enable **Email/Password** ✓
4. Can disable **Phone** if you want

### Enable Google Auth

1. In **Sign-in method** tab
2. Enable **Google** ✓
3. Add OAuth redirect URLs (automatic for localhost)

### No More Test Phone Numbers Needed

- You can remove test phone numbers from Firebase Console
- No need for reCAPTCHA configuration

---

## Testing the New Flow

### Email/Password Signup

```
1. Go to http://localhost:5173/signup
2. Enter:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm: password123
3. Click "Sign Up"
4. Should redirect to /resume
```

### Google Signup

```
1. Go to http://localhost:5173/signup
2. Click "Google" button
3. Select or sign in with Google account
4. Should redirect to /resume
```

### Email/Password Login

```
1. Go to http://localhost:5173/login
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click "Login"
4. Should redirect to /resume
```

### Google Login

```
1. Go to http://localhost:5173/login
2. Click "Google" button
3. Should redirect to /resume
```

---

## API Changes

### POST /api/users/create

**Old Request Body:**

```json
{
  "uid": "...",
  "name": "...",
  "email": "...",
  "phone": "+1234567890"
}
```

**New Request Body:**

```json
{
  "uid": "...",
  "name": "...",
  "email": "..."
}
```

### Database Migration (if existing data)

```javascript
// Optional: Remove phone field from existing users
db.users.updateMany({}, { $unset: { phone: "" } });
```

---

## Security Considerations

### Password Handling

- Passwords are handled **entirely by Firebase**
- Passwords are **never sent to your backend**
- Firebase provides secure password hashing and verification

### Token Usage

- Still using Firebase ID tokens for authorization
- Backend still validates tokens with Firebase Admin SDK
- Same security model as before

### Google OAuth

- Uses Firebase's OAuth 2.0 implementation
- No need to store Google tokens
- User data passed to backend through Firebase

---

## No OTP Limitation

- ✅ **Unlimited signups** (no 10/day limit)
- ✅ **Instant login** (no OTP wait time)
- ✅ **Easier for users** (password instead of typing OTP)
- ✅ **Social login option** (Google Sign-In)

---

## Backward Compatibility

### New Deployments

- Use new email/password system directly
- No migration needed

### Existing Phone OTP Users

**Option 1: Keep Old Users**

- Old phone OTP users can still login if you keep phone auth
- New users use email/password

**Option 2: Force Migration**

- Send password reset emails to old users
- Have them set passwords
- Disable phone auth

---

## Troubleshooting

### "Invalid token" error

- Firebase credentials in `.env` are wrong
- Check `VITE_FIREBASE_*` values match Firebase Console

### Password validation fails

- Firebase validates passwords client-side
- Check console for specific error message
- Password must be at least 6 characters

### Google Sign-In not working

- Google auth not enabled in Firebase Console
- Check browser console for errors
- Make sure OAuth redirect URLs are correct

### User exists but can't login

- User might be created with different email
- Check MongoDB for user email spelling
- Use password reset if email is wrong

---

## Migration Checklist

- [x] Update Signup component to email/password
- [x] Update Login component to email/password
- [x] Add Google Sign-In support
- [x] Update User model (remove phone)
- [x] Update AuthContext (remove phone handling)
- [x] Update environment files
- [ ] Test email/password signup
- [ ] Test email/password login
- [ ] Test Google signup
- [ ] Test Google login
- [ ] Test password validation
- [ ] Delete old test phone from Firebase
- [ ] Verify all error messages work
- [ ] Test protected routes

---

## Summary

The authentication system is now:

- ✅ **Phone OTP Free** - Unlimited use
- ✅ **Email/Password** - Standard form-based login
- ✅ **Google Sign-In** - One-click signup
- ✅ **Secure** - Firebase handles password security
- ✅ **User Friendly** - Easier than OTP flow

Ready to test! 🚀
