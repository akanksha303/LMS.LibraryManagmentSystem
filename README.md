# 📚 Digital Library Management System (LMS)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![.NET 8.0](https://img.shields.io/badge/.NET_8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Neon PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A modern, enterprise-grade full-stack **Library Management System (LMS)** designed with clean separation of concerns. It features a robust C# ASP.NET Core REST API backend, a responsive React.js SPA frontend built with TypeScript and Tailwind CSS, and a serverless Neon PostgreSQL database in the cloud.

---

## 🌟 Key Features

*   🎨 **Premium Split-Screen Login Page**: High-resolution layouts containing quick pre-fill demo role selection cards.
*   📊 **Student Dashboard**: Royal Violet glassmorphic interface showing metrics (loans, fines, overdues) and a wide recommended books list.
*   📖 **Magazines Catalog**: Clean, Solid Orange themed database lookup containing genre filtering, magnifying glass search, availability labels, and pagination.
*   🤖 **AI Library Assistant**: Built-in chatbot console connected to the backend mock LLM service, offering conversational book recommendations.
*   💳 **Fines Billing Engine**: Automatically calculates overdue fine penalties ($1.00 per late day) during book return check-ins.
*   🔐 **Role-Based Security**: Role guards protecting Student, Librarian, and Administrator views backed by JWT session authorization.

---

## 🛠️ Technology Stack

*   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Axios, React Router 6, Lucide React (Icons).
*   **Backend**: C# 12, .NET 8.0 SDK, ASP.NET Core Web API, Entity Framework Core, ASP.NET Core Identity, JWT Bearer Token, Npgsql (Postgres provider).
*   **Database**: Neon PostgreSQL 15 (Cloud serverless database).
*   **Deployment**: Docker (backend container), Render.com (API Hosting), Vercel.com (SPA Static Hosting).

---

## 📁 Folder Structure

```text
LMS.LIbraryaManagementSystem/
├── docker-compose.yml           # Runs local container clusters (DB, API, Web)
├── backend/                     # C# .NET 8.0 Solution
│   ├── Lms.Core/                # Domain Entities & Contracts
│   ├── Lms.Application/         # Validation Rules & Business Services
│   ├── Lms.Infrastructure/      # DB Context, Repositories & Security Setup
│   └── Lms.Api/                 # Endpoint Controllers & Dockerfile
└── frontend/                    # Vite + React Client
    ├── src/                     # React Components & State Contexts
    ├── vercel.json              # Rewrites routing config for Vercel
    └── Dockerfile               # Production Nginx bundle script
```

---

## 🔑 Demo Login Credentials

For testing and evaluating the viewpoints, select the card icons on the Login Screen or enter the credentials below:

1.  **Student Portal**:
    *   **Email**: `student@lms.com`
    *   **Password**: `Student123!`
2.  **Librarian Portal**:
    *   **Email**: `librarian@lms.com`
    *   **Password**: `Librarian123!`
3.  **Administrator Portal**:
    *   **Email**: `admin@lms.com`
    *   **Password**: `Admin123!`

---

## 🚀 How to Run Locally

### Prerequisites
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   [Node.js (v18+)](https://nodejs.org/)

### Step 1: Run the Backend API
1.  Navigate to the API folder:
    ```bash
    cd backend/Lms.Api
    ```
2.  Restore packages and run (defaults to offline SQLite `lms.db` automatically):
    ```bash
    dotnet run
    ```
    *The API will be available at `http://localhost:5000` with Swagger documentation at `http://localhost:5000/swagger`.*

### Step 2: Run the Frontend Portal
1.  Navigate to the frontend folder:
    ```bash
    cd ../../frontend
    ```
2.  Install packages and start the developer server:
    ```bash
    npm install
    npm run dev
    ```
    *Open `http://localhost:5173` in your browser to view the application.*

---

## ☁️ Cloud Deployment Mappings

The production version is hosted online at:
*   **Database**: Neon PostgreSQL cloud server.
*   **Backend REST API**: Hosted on Render.com using multi-stage Docker builds.
*   **Frontend Client**: Hosted on Vercel.com pointing to the Render API url.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
