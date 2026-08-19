# RoleForge 🚀

### AI-Powered Resume Intelligence

RoleForge is a full-stack AI-powered career platform designed to simulate a real-world recruitment product. It helps candidates **analyze resumes against job descriptions, identify skill gaps, generate ATS-optimized resumes, and prepare for interviews using AI-generated questions**.

The project combines **Full Stack Development, Generative AI, authentication security, resume parsing, skill analysis, and automated PDF generation** into one production-style application.

---

## ✨ What is RoleForge?

Most resume builders simply help users create a resume.

**RoleForge goes a step further.**

It analyzes the relationship between:

**Candidate Resume → Target Job → Required Skills → Skill Gaps → Interview Preparation**

A candidate can upload their resume, provide a job description, and receive actionable insights about how well their profile matches the target role.

---

## 🎯 Core Features

### 📄 Resume Upload & Parsing

* Upload existing resumes
* Extract resume content
* Parse skills, education, experience, and projects
* Convert unstructured resume information into structured candidate data

### 🔍 Job Description Analysis

* Analyze job descriptions
* Extract required technical and soft skills
* Identify experience requirements
* Detect important keywords and technologies

### 🧠 AI-Powered Skill Gap Detection

RoleForge compares the candidate's profile with the requirements of a target job.

It identifies:

* ✅ Matching skills
* ⚠️ Missing skills
* 📈 Recommended areas for improvement
* 🎯 Role-specific preparation priorities

### 🤖 AI Interview Question Generation

Using the analyzed resume and job description, RoleForge can generate:

* Technical interview questions
* Resume-based questions
* Role-specific questions
* Project-based questions
* Behavioral questions
* Difficulty-based questions

### 📊 Candidate Analysis

The platform can provide an overall view of how closely a candidate's profile matches a target role.

Example:

```text
Role Match
━━━━━━━━━━━━━━━━━━━━━━━━━━
██████████████████░░ 82%

Strong Areas:
✓ JavaScript
✓ React
✓ Node.js
✓ REST APIs

Skill Gaps:
• Docker
• Kubernetes
• CI/CD
• AWS
```

### 📝 ATS-Optimized Resume Generation

RoleForge can generate a resume optimized around the requirements of a target job.

The system focuses on:

* Relevant keywords
* Clear formatting
* Role-specific content
* Achievement-oriented descriptions
* ATS-friendly structure

### 📑 Dynamic PDF Generation

Generated resumes can be converted into professional PDF documents using **Puppeteer**.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js/Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌────────────┐
        │ MongoDB   │    │ Gemini API │   │ Puppeteer  │
        │ Database  │    │    AI      │   │ PDF Engine │
        └───────────┘    └────────────┘   └────────────┘
              │
              ▼
       Candidate Data
       Resume Data
       Job Analysis
       Skill Analysis
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

## Database

* MongoDB
* Mongoose

## AI

* Google Gemini API

Used for:

* Resume analysis
* Job description analysis
* Skill extraction
* Skill-gap detection
* Interview question generation
* Resume content optimization

## Security

* JWT authentication
* Token blacklisting
* Password hashing
* Protected API routes
* Role-based authorization

## PDF Generation

* Puppeteer
* HTML/CSS resume templates

---

# 🔐 Authentication Architecture

RoleForge implements secure authentication using JWT.

### Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Backend validates credentials
 │
 ▼
JWT generated
 │
 ▼
Client stores authentication state
 │
 ▼
Protected API requests
 │
 ▼
JWT verification middleware
 │
 ▼
Authorized request
```

### Token Blacklisting

When a user logs out, the token can be invalidated using a blacklist mechanism.

```text
Logout
   │
   ▼
JWT extracted
   │
   ▼
Token added to blacklist
   │
   ▼
Future request
   │
   ▼
Blacklist check
   │
   ├── Blacklisted → ❌ Reject
   │
   └── Valid → ✅ Continue
```

This prevents a previously issued token from remaining usable after logout.

---

# 🤖 AI Processing Pipeline

RoleForge uses Gemini to process resume and job-related information.

```text
Resume
   │
   ▼
Resume Parsing
   │
   ▼
Skill Extraction
   │
   ▼
Candidate Profile
   │
   │
   ├───────────────┐
   │               │
   ▼               ▼
Job Description   Candidate
Analysis          Profile
   │               │
   └───────┬───────┘
           ▼
     Skill Comparison
           │
           ▼
      Skill Gaps
           │
           ▼
 Interview Questions
```

---

# 📂 Project Structure

```text
RoleForge/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── app.js
│   └── server.js
│
├── templates/
│   └── resume/
│       ├── modern.html
│       ├── professional.html
│       └── minimal.html
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

# 🔄 Application Workflow

### Step 1 — Create Account

The candidate registers and securely authenticates with RoleForge.

### Step 2 — Upload Resume

The candidate uploads an existing resume.

### Step 3 — Add Job Description

The candidate pastes a target job description.

### Step 4 — Analyze Profile

RoleForge extracts relevant information from both sources.

### Step 5 — Detect Skill Gaps

The system compares the candidate's skills against the requirements of the target position.

### Step 6 — Generate Interview Questions

Gemini generates questions based on the candidate's resume and target role.

### Step 7 — Optimize Resume

RoleForge generates an ATS-friendly version tailored toward the selected job.

### Step 8 — Export PDF

Puppeteer converts the generated resume into a downloadable PDF.

---

# 📊 Example Skill Analysis

### Target Role

```text
Backend Developer
```

### Required Skills

```text
Node.js
Express.js
MongoDB
Docker
AWS
REST APIs
CI/CD
Git
```

### Candidate Skills

```text
Node.js
Express.js
MongoDB
REST APIs
Git
```

### Analysis

```text
Match: 62%

Matched:
✓ Node.js
✓ Express.js
✓ MongoDB
✓ REST APIs
✓ Git

Missing:
✗ Docker
✗ AWS
✗ CI/CD
```

RoleForge can then generate interview questions specifically around the candidate's current profile and missing requirements.

---

# 🧪 Example AI Prompt Strategy

The backend can provide Gemini with structured context such as:

```text
Candidate Skills:
React.js, Node.js, Express.js, MongoDB, Git

Target Role:
Full Stack Developer

Required Skills:
React.js, Node.js, Express.js, MongoDB, Docker,
AWS, CI/CD

Identify:
1. Matching skills
2. Missing skills
3. Priority skill gaps
4. Recommended interview questions
5. Resume optimization suggestions
```

Structured prompting helps keep AI responses consistent and easier for the backend to process.

---

# 🔒 Security Considerations

RoleForge is designed with production-style security principles.

* Password hashing
* JWT authentication
* Token blacklisting
* Protected routes
* Authentication middleware
* Input validation
* Environment variables for secrets
* API authorization
* Secure file handling
* Error handling
* CORS configuration

Sensitive credentials should never be committed to GitHub.

---

# ⚙️ Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/roleforge.git

cd roleforge
```

## 2. Install dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

## 3. Configure environment variables

Create the required `.env` file inside the backend directory.

## 4. Start the backend

```bash
cd server
npm run dev
```

## 5. Start the frontend

```bash
cd client
npm run dev
```

The application will then be available locally.

---

# 🧩 API Architecture

Example endpoints:

```text
/auth
    POST   /register
    POST   /login
    POST   /logout

/resume
    POST   /upload
    GET    /:id
    DELETE /:id

/jobs
    POST   /analyze
    GET    /:id

/skills
    POST   /analyze-gap

/interview
    POST   /generate
    GET    /:id

/resume-generator
    POST   /generate
    POST   /pdf
```

---

# 📈 Future Enhancements

RoleForge can evolve beyond resume optimization.

### Planned possibilities

* 🎤 AI mock interviews
* 🗣️ Voice-based interview practice
* 📊 Interview performance analytics
* 💼 Job recommendation engine
* 🔗 GitHub profile analysis
* 🔗 LinkedIn profile analysis
* 📄 Multiple resume templates
* 🧠 Personalized learning roadmap
* 📈 Application tracking dashboard
* 📨 Job application tracking
* 🏆 Candidate readiness score
* ⚡ Real-time interview sessions

---

# 🎓 What This Project Demonstrates

RoleForge is intentionally designed as a **portfolio-grade full-stack project**, rather than a simple CRUD application.

It demonstrates:

* Full-stack architecture
* REST API development
* Secure authentication
* JWT lifecycle management
* Token blacklisting
* MongoDB data modeling
* File processing
* AI API integration
* Prompt engineering
* Resume parsing
* Natural-language processing workflows
* Skill matching
* Dynamic document generation
* PDF automation
* Frontend/backend integration
* Production-style project organization

---

# 🌟 Why RoleForge?

Traditional resume builders ask:

> **"What does your resume look like?"**

RoleForge asks:

> **"How well does your profile fit the role you're targeting?"**

That shift—from **document creation to candidate intelligence**—is the core idea behind RoleForge.

---

## 👩‍💻 Author

**Anukriti Gupta**

B.Tech — Information Technology

Interested in Full Stack Development, DevOps, Cloud Computing, and Generative AI.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with React, Node.js, MongoDB, Gemini & Puppeteer.
</p>
