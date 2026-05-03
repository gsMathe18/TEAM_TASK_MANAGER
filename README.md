# Task Management System

This project is a full-stack web application built to manage team tasks in an organized way. It allows an admin to create projects, assign tasks to members, and track progress, while members can view and update their assigned work.

---

## Overview

The main goal of this system is to simplify task handling within a team. It provides a clear structure where work is divided into projects, tasks are assigned to specific users, and progress can be monitored through a dashboard.

---

## Features

### Admin Capabilities
- Create new projects
- Add team members to projects
- Assign tasks to members
- View all tasks across projects
- Track progress using dashboard insights

### Member Capabilities
- View tasks assigned to them
- Update task status
- Keep track of deadlines

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication
- JSON Web Token (JWT)

---

## How It Works

1. A user signs up and logs into the system  
2. Admin creates a project  
3. Members are added to the project  
4. Tasks are assigned to members  
5. Members update task status  
6. Dashboard reflects real-time progress  

---

## Project Structure
client/
src/
pages/
components/
api/

server/
controllers/
models/
routes/
middleware/

---

## Setup Instructions

### Step 1: Clone the Repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git


---

### Step 2: Backend Setup

cd server
npm install


Create a `.env` file inside the server folder and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


Run the backend:

npm run dev


---

### Step 3: Frontend Setup

cd client
npm install
npm start


---

## API Base URL


http://localhost:5000/api


---

## Dashboard Details

The dashboard provides a quick summary of:
- Total tasks
- Completed tasks
- Pending tasks
- Tasks in progress
- Overdue tasks

---

## Deployment

The application can be deployed using:
- Backend → Railway  
- Frontend → Vercel  

---

## Author

Ganesh Mathe  
Final Year B.Tech (Information Technology)

---

## Note

This project was developed as part of academic learning and