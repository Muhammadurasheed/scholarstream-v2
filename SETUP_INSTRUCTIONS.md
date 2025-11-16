# ScholarStream Setup Instructions

**Bismillah ir-Rahman ir-Rahim** ✨

## Quick Start Guide

### 1. Frontend Setup (React + Firebase)

#### Create your `.env` file:
```bash
# In the project root (same folder as package.json)
cp .env.example .env
```

#### Get your Firebase credentials:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Click the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. Click the web icon `</>` to create a web app
6. Copy the `firebaseConfig` object values
7. Paste them into your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Enable Firebase Authentication:
1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. (Optional) Enable "Google" sign-in method

#### Enable Firestore Database:
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Start in **Test mode** for development
4. Choose your region

#### Run the frontend:
```bash
npm install
npm run dev
```

### 2. Backend Setup (FastAPI + Python)

#### Create backend `.env` file:
```bash
cd backend
cp .env.example .env
```

#### Get Firebase Admin SDK credentials:
1. In Firebase Console → Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Extract values and add to `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

#### Get Google Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyC...
```

#### Get Upstash Redis credentials (Optional but recommended):
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a Redis database
3. Copy the REST URL and token
4. Add to `backend/.env`:
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

#### Get Cloudinary credentials:
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up/Login
3. Get your credentials from the dashboard
4. Add to `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your-secret
```

#### Install dependencies and run:
```bash
# Activate conda environment
conda activate scholarstream

# If environment doesn't exist, create it:
# conda create -n scholarstream python=3.11 -y
# conda activate scholarstream

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

The backend will be available at: http://localhost:8000
API docs: http://localhost:8000/docs

## Troubleshooting

### Frontend Issues

❌ **Error: "Firebase: Error (auth/api-key-not-valid)"**
- Your `.env` file is missing or has incorrect Firebase credentials
- Make sure `.env` is in the project root (not in `src/`)
- Restart the dev server after creating/updating `.env`

❌ **Firebase imports failing**
- Run: `npm install firebase`

### Backend Issues

❌ **ModuleNotFoundError: No module named 'fastapi'**
- Make sure conda environment is activated: `conda activate scholarstream`
- Reinstall dependencies: `pip install -r requirements.txt`

❌ **ValidationError for Settings**
- Your `backend/.env` file is missing required variables
- Check `backend/.env.example` for all required fields
- Make sure Firebase private key is properly escaped

❌ **Backend logs not showing**
- The backend now uses colored console output in development
- JSON logs are only used in production

## Need Help?

1. Check `FIREBASE_SETUP.md` for detailed Firebase setup
2. Check `backend/README.md` for backend-specific docs
3. Ensure all `.env` files are properly configured
4. Make sure conda environment is activated for backend

**Allahu Musta'an** 🤲
