# Enterprise Human Resource Management System (HRMS)

An enterprise-grade, modern, and highly polished Full-Stack Human Resource Management System (HRMS). Built with **React 19, TypeScript, Tailwind CSS v4, Node.js, Express, and JWT Authentication**.

This system features a high-fidelity dashboard styled after industry leaders like Stripe and Vercel. It is fully operational with role-based features for Admins, HR Managers, and Employees.

---

## 🚀 Key Features

*   **Premium Glassmorphic Dashboard**: Clean typography, rich layout variations, dark & light visual theme, smooth entrance animations, hover micro-interactions, and beautiful charts powered by **Recharts**.
*   **Dual-Mode Stateful Database**: Designed for cloud scaling. Operates seamlessly in MongoDB/Mongoose OR auto-switches to a robust local file-persisted JSON database (`data.json`) for sandbox preview out of the box.
*   **Role-Based Access Control**: Fully integrated workflows tailored for **Admins**, **HR Managers**, and **Staff Employees**.
*   **Real-time Shift Punch-In/Out Clock**: A precise live timer featuring simulated geographical zoning (Wi-Fi zone detection) and work-hour calculators.
*   **Approval-Comment Leave Planner**: Submit casual, annual, or medical leaves. Review, comment on, and process requests from the administrative control board.
*   **Monthly Batch Payroll Disbursals**: Recalculate allowances, add deductions, and instantly generate ledger records and download printable payslips.
*   **Context-Based Interceptor auth**: Secure token storage with Axios request interceptors that inject JWT headers automatically.

---

## 🛠️ Technology Stack

### Frontend
*   **React 19 & TypeScript**: Component modularity and complete type-safety.
*   **React Router v6**: Seamless clientside routing.
*   **Tailwind CSS v4**: Theme styling and responsive configurations.
*   **Recharts**: High-contrast, interactive vector data visualization.
*   **Axios**: Centralized client communication with request-response interceptors.
*   **Lucide React**: Crisp UI iconography.

### Backend
*   **Node.js & Express**: High-speed REST API routing and modular handlers.
*   **JWT Token Authorization**: Secure, state-free credential management.
*   **Bcryptjs Hashing**: Heavy industry standard password encryptions.
*   **Local FS / MongoDB dual DB**: State-persisted files for out-of-the-box performance.

---

## 🔐 Credentials Checklist (Fast Quick-Login)

To make review and testing completely instantaneous, the system contains fully pre-configured accounts. Use the **Quick-Login Buttons** on the Login Screen or type manually:

| Account Role | Username | Password | Linked Employee ID | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `password123` | *None* | Full read/write/delete permissions. Manage salary scales. |
| **HR Manager** | `jane_hr` | `password123` | `EMP001` (Jane Doe) | Core directory edit. Process leave approvals, issue payroll. |
| **Employee** | `john_emp` | `password123` | `EMP002` (John Smith) | Apply leaves, view payslips, record shift punchings. |
| **Lead Designer** | `alice_emp` | `password123` | `EMP003` (Alice Johnson) | Apply leaves, view payslips, record shift punchings. |

---

## 📂 Project Directory Structure

```
├── .env.example              # Environments reference
├── package.json              # Central scripts and dependencies
├── server.ts                 # Full-stack Node/Express Vite middleware engine
├── data.json                 # Auto-generated persistent JSON database
├── server/                   # Backend Module
│   ├── db.ts                 # File-persisted seed manager
│   ├── authMiddleware.ts     # JWT verify and Role filter guards
│   └── apiRouter.ts          # Express REST API routes and analytics logic
├── src/                      # Frontend Module
│   ├── types.ts              # Global strongly typed models
│   ├── main.tsx              # React bootstrap entry point
│   ├── index.css             # Google Fonts imports and Tailwind configurations
│   ├── App.tsx               # Main routing router and layout shell
│   ├── components/           # Extracted Reusable Components
│   │   ├── Sidebar.tsx       # Dynamic role-based navigation sidebar
│   │   ├── Navbar.tsx        # Top header & notification center slide-out
│   │   ├── ThemeToggle.tsx   # Dark/Light responsive mode toggler
│   │   └── PayslipModal.tsx  # Printable official PDF-styled payslip receipt
│   ├── pages/                # High-fidelity dashboard views
│   │   ├── Login.tsx         # Modern split-screen SaaS login page
│   │   ├── AdminDashboard.tsx# Core analytical stats and Recharts dashboards
│   │   ├── EmployeeDashboard.tsx # Real-time shift puncher and personal stats
│   │   ├── EmployeesPage.tsx # Directory catalog and CRUD controllers
│   │   ├── AttendancePage.tsx# Log audits and personal calendar sheets
│   │   ├── LeavesPage.tsx    # Leave Scheduler form and review boards
│   │   ├── ProfilePage.tsx   # Contact and direct-deposit banking editor
│   │   └── PayrollPage.tsx   # Financial payroll ledger and payslips
│   └── utils/
│       └── api.ts            # Configured Axios Client with Interceptors
```

---

## 🛰️ REST API Specification

All routes are fully authenticated with a JWT Bearer token in the `Authorization` header except public auth endpoints:

### Authentication
*   `POST /api/auth/register` - Register a new system account credential.
*   `POST /api/auth/login` - Validate username and password. Issues a 7-day JWT Token.

### Employees
*   `GET /api/employees` - List employees (Admins/HR see all; Employee sees colleagues).
*   `POST /api/employees` - Register a new employee and auto-generate credentials (*Admin/HR only*).
*   `PUT /api/employees/:id` - Update contact and banking details.
*   `DELETE /api/employees/:id` - Wipe an employee and their login credentials (*Admin only*).

### Attendance Shift Tracker
*   `GET /api/attendance` - Query chronological shift check-ins.
*   `POST /api/attendance/check-in` - Record precise latitude Wi-Fi clock-in.
*   `POST /api/attendance/check-out` - Compute hours and end day.

### Leave Planner
*   `GET /api/leaves` - View submitted leaves.
*   `POST /api/leaves` - Submit time-off request (Employee).
*   `PUT /api/leaves/:id` - Approve/Reject leave with manager comments (*Admin/HR only*).

### Payroll & Ledger
*   `GET /api/payroll` - Read historical payslips ledger.
*   `POST /api/payroll/generate` - Generate batch payroll for all employees for a month (*Admin/HR only*).
*   `PUT /api/payroll/:id` - Adjust base allowances, deductions, and mark as Disbursed/Paid (*Admin/HR only*).

---

## 🛠️ Local Installation & Launch Guide

Follow these steps to run this full-stack application on your local machine:

1.  **Clone / Download** this repository package and ensure Node.js (v18+) is installed.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env` file in the root based on `.env.example`:
    ```env
    PORT=3000
    JWT_SECRET=my_secret_key_string
    # Optionally supply MongoDB URI for cloud DB override
    # MONGODB_URI=mongodb+srv://...
    ```
4.  **Launch Development Server**:
    Starts Node Express backend with hot-loading Vite frontend attached as middleware:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    Compiles Vite SPA client and esbuild-bundles the backend server into optimized production CommonJS format:
    ```bash
    npm run build
    ```
6.  **Production Launch**:
    ```bash
    npm run start
    ```

---

## 🛡️ License
Distributed under the Apache-2.0 License. See `LICENSE` for more details.
