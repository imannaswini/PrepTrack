# ⚡ PrepTrack

**PrepTrack** is a high-fidelity, AI-driven interview preparation platform designed to help students and job seekers bridge the gap between their skills and industry expectations. By analyzing resumes and generating tailored technical questions, PrepTrack provides a personalized roadmap to career success.

---

## 🚀 Features

### ✅ Completed
- **Secure Authentication**: JWT-based login and registration system.
- **Dynamic Dashboard**: Real-time progress tracking with a premium, glassmorphic UI.
- **Question Tracker**: Log and monitor your practice sessions across different topics.
- **Smart Resume Analysis**: 
    - PDF Resume Upload.
    - Intelligent text parsing from complex PDF structures.
    - Automated **Skill Extraction** (React, Node.js, Python, etc.).
- **Live Skill Display**: Extracted skills are instantly visualized as tags on your profile.
- **Database Persistence**: Fully integrated with MongoDB for robust data management.

### 🛠️ In Progress & Upcoming
- **AI Question Generator**: Automatic creation of 3+ technical questions per extracted skill.
- **Mock Interview Simulator**: Interactive session to practice answering generated questions.
- **Timer-based Practice**: Realistic interview simulation with time constraints.
- **Performance Analytics**: Visualized metrics of your strengths and weaknesses.
- **Weak Topic Detection**: Smart suggestions on what to study next.

---

## 📸 Screenshots

| Dashboard View | Resume Analysis |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=PrepTrack+Dashboard) | ![Resume Analysis Placeholder](https://via.placeholder.com/600x350?text=Resume+Analysis+Card) |

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js 19 (Vite)
- **Styling**: Tailwind CSS v4 (Vanilla CSS fallback)
- **Animations**: Custom CSS Keyframes / Framer Motion (Ready)
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Parsing**: `pdf-parse` & `multer`
- **Security**: `bcryptjs` & `jsonwebtoken`

### Database
- **Provider**: MongoDB Atlas
- **ODM**: Mongoose

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account

### 1. Clone the repository
```bash
git clone https://github.com/imannaswini/PrepTrack.git
cd PrepTrack
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```text
PrepTrack/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth & Error handling
│   ├── models/         # Mongoose schemas (User, Resume, Questions)
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios configuration
│   │   ├── pages/      # Dashboard, Questions, Auth
│   │   └── index.css   # Modern Design System (Tailwind v4)
│   └── public/
└── README.md
```

---

## 🗺️ Roadmap
- [x] Phase 1: Foundation & Auth
- [x] Phase 2: Resume Processing Engine
- [ ] Phase 3: Mock Interview Module (Current Focus)
- [ ] Phase 4: AI Evaluation & Feedback
- [ ] Phase 5: Analytics Dashboard

---


