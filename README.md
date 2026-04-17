# PrepTrack 

PrepTrack is a full-stack MERN project designed for CSE students to prepare for placements and technical interviews.

It helps users track coding questions, practice aptitude, monitor progress, and stay resume-ready through a clean dashboard experience.

---

##  Features

###  Authentication

* User Registration
* User Login
* JWT Token Authentication
* Protected Routes

### Dashboard

* Total Questions
* Solved Questions
* Pending Questions

### Coding Question Tracker

* Add Questions
* View All Questions
* Delete Questions
* Difficulty Tracking (Easy / Medium / Hard)
* Status Tracking (Solved / Pending)

###  Aptitude Practice

* Sample aptitude questions
* Quantitative reasoning
* Logical reasoning

###  Resume Checklist

* Resume Updated
* GitHub Updated
* LinkedIn Updated
* Projects Added
* Skills Updated

---

##  Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* bcryptjs

---

## Project Structure

```bash
PrepTrack/
│── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── api.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

## 1️ Clone Repository

```bash
git clone https://github.com/your-username/preptrack.git
cd PrepTrack
```

---

## 2 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```
For JWT key 
Run directly in terminal:

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run backend:

```bash
npm run dev
```

---

## 3️ Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

##  Local URLs

### Frontend

```bash
http://localhost:5173
```

### Backend

```bash
http://localhost:5000
```

---

##  Main Modules

### Login / Register

Secure authentication using JWT.

### Dashboard

Track interview preparation progress.

### Questions Tracker

Manage coding questions by topic and difficulty.

### Aptitude Section

Practice basic placement aptitude questions.

### Resume Checklist

Track resume readiness before placements.

---

##  Future Improvements

* Edit Question Feature
* Search & Filter Questions
* Daily Coding Challenge
* Company-wise Preparation Roadmap
* Resume Score Analyzer
* Mock Interview Questions
* Progress Charts
* Dark Mode

---


