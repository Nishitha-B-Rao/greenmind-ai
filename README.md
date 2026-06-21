# 🌱 GreenMind AI – Your Personal Climate Coach

A smart, full-stack web application that helps users understand and reduce their carbon footprint through AI-driven lifestyle assessments, personalized coaching, and intelligent receipt analysis.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [User Journey](#user-journey)
- [Contributing](#contributing)
- [License](#license)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

GreenMind AI bridges the gap between environmental awareness and actionable change. Instead of tedious carbon calculators, we use **Gemini 2.5 Flash AI** to:
- Create personalized carbon profiles based on lifestyle conversations
- Generate achievable weekly sustainability challenges
- Provide real-time coaching through an AI chat widget
- Analyze grocery receipts for carbon-impact insights

### Problem Statement
Traditional carbon calculators are data-heavy and lack personalization. GreenMind AI makes sustainability accessible, engaging, and actionable for everyday users.

## ✨ Features

### 🔐 Authentication
- Firebase Authentication for secure session management
- Google Sign-In Provider via Firebase Client SDK
- Firebase Admin SDK for secure API route verification

### 📊 Intelligent Onboarding Assessment
- 5-step AI-powered questionnaire
- Gemini 2.5 Flash analyzes responses to establish baseline carbon score
- Identifies top emission sources without requiring exact numerical data
- Generates personalized recommendations

### 🎨 Enhanced AI Dashboard
- **Hero Card**: Visual carbon score and risk level indicator
- **AI Insight Card**: Explains top emission source with tailored advice
- **Challenge Widget**: Auto-generated weekly sustainability challenges
- **Progress Tracker**: Monitors completed challenges and trends

### 💬 Climate Coach (Chat Widget)
- Floating AI assistant available throughout the app
- Personalized advice based on user profile
- Conversational, actionable responses (under 3 sentences)
- Chat history stored in MongoDB

### 📸 AI Receipt Scanner
- Upload grocery receipts (JPG/PNG)
- Gemini Vision analyzes items for carbon impact
- Identifies highest carbon-impact item
- Suggests eco-friendly alternatives

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Next.js Route Handlers |
| **Authentication** | Firebase Auth (Client), Firebase Admin (Server) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI/ML** | Google Gemini 2.5 Flash API |
| **Deployment** | Vercel (recommended) |

## 📁 Project Structure

```
greenmind-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # Backend API routes
│   │   │   ├── assessment/           # POST: Create assessment
│   │   │   ├── challenges/           # GET/POST: Challenge management
│   │   │   ├── chat/                 # POST: Chat messages
│   │   │   ├── dashboard/            # GET: Dashboard data
│   │   │   ├── receipt/              # POST: Receipt analysis
│   │   │   └── user/                 # GET/POST: User profile
│   │   ├── assessment/               # Assessment page
│   │   ├── dashboard/                # Dashboard page & components
│   │   │   └── components/
│   │   │       ├── HeroCard.tsx
│   │   │       ├── InsightCard.tsx
│   │   │       ├── ChallengeCard.tsx
│   │   │       └── ProgressWidget.tsx
│   │   ├── login/                    # Login page
│   │   ├── scanner/                  # Receipt scanner page
│   │   ├── layout.tsx                # Root layout with Auth provider
│   │   ├── page.tsx                  # Home redirect logic
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── AuthContext.tsx           # Auth state management
│   │   ├── ChatWidget.tsx            # Floating chat component
│   │   ├── Navigation.tsx            # Nav component
│   │   └── ui/                       # shadcn UI components
│   ├── lib/
│   │   ├── firebase.ts               # Firebase client config
│   │   ├── firebaseAdmin.ts          # Firebase admin SDK
│   │   ├── mongodb.ts                # MongoDB connection
│   │   └── utils.ts                  # Helper utilities
│   └── models/                       # Mongoose schemas
│       ├── User.ts
│       ├── Assessment.ts
│       ├── Challenge.ts
│       ├── ChatMessage.ts
│       └── ReceiptAnalysis.ts
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Actual env vars (git-ignored)
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind CSS config
└── package.json                      # Dependencies & scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas account
- Google OAuth credentials
- Gemini API key from Google AI Studio
- Firebase project

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd greenmind-ai
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🔑 Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greenmind?appName=YourApp

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side API verification)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=AIzaXXXXXXXXXXX
```

### Getting Credentials

**Firebase & Google OAuth:**
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication -> Google Sign-In provider
3. Get Web configuration keys for `.env.local`
4. Download Admin SDK service account JSON from Settings → Service Accounts for server-side config

**Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key (free tier available)



**MongoDB:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database user
3. Copy connection string

## 📡 API Endpoints

All endpoints require Firebase Bearer token in `Authorization` header.

### Assessment
- **POST** `/api/assessment` - Create new assessment from questionnaire
- **GET** `/api/assessment` - Fetch user's latest assessment

### Challenges
- **GET** `/api/challenges/generate` - Generate new weekly challenge
- **POST** `/api/challenges/[id]/complete` - Mark challenge as completed
- **GET** `/api/challenges` - Fetch all user challenges

### Chat
- **POST** `/api/chat` - Send message to climate coach
  - Body: `{ message: string, history: ChatMessage[] }`
  - Returns: `{ reply: string }`

### Dashboard
- **GET** `/api/dashboard` - Fetch dashboard data
  - Returns: `{ assessment, challenges, user }`

### Receipt
- **POST** `/api/receipt` - Upload & analyze receipt image
  - Body: FormData with image file
  - Returns: `{ highestCarbonItem, alternatives }`

### User
- **GET** `/api/user` - Fetch user profile
- **POST** `/api/user` - Update user profile

## 👥 User Journey

```
1. LANDING PAGE
   └─ User visits http://localhost:3000
   
2. AUTHENTICATION
   └─ Redirected to /login if not authenticated
   └─ Google OAuth sign-in
   
3. FIRST-TIME SETUP
   └─ Redirected to /assessment if onboarding not completed
   └─ 5-step questionnaire
   └─ Gemini AI generates carbon score & profile
   
4. DASHBOARD (Main Experience)
   ├─ View carbon score (Hero Card)
   ├─ Get personalized insight (Insight Card)
   ├─ Accept weekly challenge (Challenge Card)
   └─ Track progress (Progress Widget)
   
5. ONGOING FEATURES
   ├─ Chat Widget - Available everywhere
   ├─ Receipt Scanner - /scanner page
   └─ Challenge Updates - Weekly
```

## 🤝 Contributing

1. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. Make your changes and test locally
3. Commit with clear messages
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request with description

### Code Standards
- Use TypeScript for all new code
- Follow existing component patterns
- Add comments for complex logic
- Test API endpoints before submitting PR

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Fails
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure database user credentials are correct
- Test with MongoDB Compass

### Firebase Authentication Issues
- Verify Firebase credentials in `.env.local`
- Check Google OAuth redirect URIs include localhost:3000
- Clear browser cookies: Ctrl+Shift+Delete
- Check Firebase Console for errors

### Gemini API Errors
- Verify API key is valid and has quota
- Check [Google Cloud Console](https://console.cloud.google.com/) for rate limits
- Ensure `gemini-2.5-flash` model is available in your region
- Check API is enabled in Google Cloud project

### Chat Widget Not Appearing
- Check browser console for errors
- Verify user is authenticated (`useAuth()` hook)
- Ensure ChatWidget component is imported in layout

### Build Errors
```bash
# Clear caches and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript
npx tsc --noEmit

# Update type definitions
npm update --save-dev @types/node @types/react
```

## 📞 Support

For issues or questions:
1. Check existing [GitHub Issues](../../issues)
2. Review code comments and inline docs
3. Check browser console for client-side errors
4. Check server logs for API errors

---

**Let's make sustainability simple! 🌿**
