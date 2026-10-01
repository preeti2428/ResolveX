# ResolveX — Department Grievance Redressal Portal (Frontend)

**ResolveX** is the official student and faculty client portal for the **Department of Artificial Intelligence & Machine Learning (AIML & AI)** across all academic years (1st, 2nd, 3rd, and 4th Year).

Built with **React**, **Vite**, and **Tailwind CSS**, it empowers Class Representatives (CRs) and Faculty Members to submit, track, and manage academic, infrastructure, GPU lab, and facility grievances in real-time.

---

## 🏛️ Ecosystem Repositories

ResolveX is architected into three dedicated repositories:
1. **Frontend (This Repo)**: [ResolveX](https://github.com/preeti2428/ResolveX) — Student & Faculty Grievance Portal
2. **Backend API**: [ResolveX-Backend](https://github.com/preeti2428/ResolveX-Backend) — Node.js, Express, MongoDB REST API
3. **Admin Dashboard**: [ResolveX-admin](https://github.com/preeti2428/ResolveX-admin) — Department HOD & Administrator Command Center

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 + Lucide React Icons
- **State Management**: React Context API (`AuthContext`, `ThemeContext`)
- **Networking**: Fetch API with modular client (`src/lib/api-client.js`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of this frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The frontend portal will start at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```text
frontend/
├── public/                 # Static assets, logos, and icons
├── src/
│   ├── components/         # Reusable UI components & modals
│   │   ├── CRDashboard.jsx         # Class Representative portal
│   │   ├── TeacherDashboard.jsx    # Faculty grievance dashboard
│   │   ├── LoginPage.jsx           # Role-based authentication
│   │   ├── GrievanceFormModal.jsx  # Grievance filing wizard
│   │   ├── GrievanceDetailModal.jsx# Live tracking & comment history
│   │   ├── ComplaintLetterModal.jsx# Formal printable letter generator
│   │   ├── AnnouncementBoard.jsx   # Department notices & circulars
│   │   ├── NotificationBell.jsx    # Real-time alert notifications
│   │   └── Navbar.jsx              # Navigation header
│   ├── context/
│   │   ├── AuthContext.jsx         # JWT session management
│   │   └── ThemeContext.jsx        # Theme toggling
│   ├── lib/
│   │   └── api-client.js           # REST API client
│   ├── App.jsx                     # View router & state coordinator
│   ├── main.jsx                    # Vite application entrypoint
│   └── globals.css                 # Tailwind design tokens
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
└── package.json
```

---

## 📄 License
ISC
