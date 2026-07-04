# Human-Resource-Management-System

live at here = https://humanresource-xi.vercel.app/login

# WorkSphere - Human Resource Management System (HRMS)

WorkSphere is a modern Human Resource Management System (HRMS) designed to simplify and automate everyday HR operations. It provides a centralized platform for managing employee information, attendance, leave requests, and payroll while offering role-based access for employees and administrators.

 Overview
Managing HR processes manually can be time-consuming and error-prone. WorkSphere streamlines these operations by providing an intuitive web application that enables employees and HR administrators to efficiently manage workforce-related activities.

The system supports secure authentication, role-based authorization, attendance tracking, leave management, employee profile management, and payroll visibility through a clean and responsive user interface.

---

 Features

### 🔐 Authentication
- Secure Sign Up and Sign In
- JWT-based Authentication
- Password Encryption using bcrypt
- Role-Based Authorization (Admin & Employee)

### 👤 Employee Profile
- View personal and professional details
- Update contact information
- Upload profile picture
- Manage personal information

### 📅 Attendance Management
- Daily Check-In / Check-Out
- Attendance History
- Daily, Weekly & Monthly Attendance Views
- Attendance Status Tracking

### 📝 Leave Management
- Apply for Leave
- Select Leave Type
- View Leave Status
- Admin Approval / Rejection Workflow

### 💰 Payroll Management
- View Salary Structure
- Payroll Dashboard
- Salary Breakdown
- Admin Payroll Management

### 📊 Dashboard
Employee Dashboard
- Profile Overview
- Attendance Summary
- Leave Status
- Payroll Overview

Admin Dashboard
- Employee Management
- Attendance Monitoring
- Leave Approval
- Payroll Management
- Workforce Statistics

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

### Version Control
- Git
- GitHub

---


📂 Project Structure

Human-Resource-Management-System/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
└── README.md
```## Installation

### Clone the Repository

```bash
git clone https://github.com/<username>/Human-Resource-Management-System.git
```

### Navigate to the Project

```bash
cd Human-Resource-Management-System
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

##  Running the Application

### Frontend

```bash
npm run dev
```

### Backend

```bash
npm start
```


## User Roles

### Employee

- View Profile
- Update Personal Information
- Check In / Check Out
- Apply for Leave
- View Attendance
- View Payroll

### Admin / HR

- Manage Employees
- Monitor Attendance
- Approve or Reject Leave Requests
- Manage Payroll
- Access Reports

---

##  Security Features

- Password Hashing
- JWT Authentication
- Protected Routes
- Role-Based Access Control
- Secure API Endpoints
- Input Validation

---

##  Future Enhancements

- Email Notifications
- Performance Evaluation
- Employee Documents Management
- Recruitment Module
- Holiday Calendar
- Department Management
- Analytics Dashboard
- Mobile Responsive Improvements
- Dark Mode

---

##  License

This project was developed for educational and hackathon purposes.

---

## 👨‍💻 Contributors

- Soham Dey
- Utsha Dey
- Soumya Pramanik
- Patotri Dey

---

##  Acknowledgements

Built with ❤️ using React, Node.js, Express, MongoDB, and TypeScript.

