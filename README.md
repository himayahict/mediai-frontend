# MediAI Frontend 🚀

**MediAI** is a modern AI-powered healthcare information assistant designed to provide users with an easy and organized way to access healthcare information, manage personal health-related activities, and interact with an AI assistant.

This repository contains the **frontend application** of MediAI, built with React and Vite.

## ✨ Features

* 🤖 **AI Assistant** – Ask healthcare-related questions and receive AI-generated informational responses.
* 🏠 **Dashboard** – Centralized home screen for accessing MediAI features.
* 📚 **Health Topics** – Explore simplified information across different health topics.
* 📋 **Appointment Preparation** – Organize questions and information before a healthcare appointment.
* 🔔 **Reminders** – Create and manage medication, exercise, water, and appointment reminders.
* 📄 **Documents** – Upload and manage health-related documents.
* 📝 **Health Journal** – Record, search, filter, edit, and manage personal journal entries.
* 👤 **User Profile** – View and update basic account information.
* 🔐 **Authentication** – Login and registration interface with protected application routes.
* 📱 **Responsive UI** – Designed to work across desktop, tablet, and mobile screen sizes.

## 🛠️ Tech Stack

* **React.js**
* **Vite**
* **JavaScript (ES6+)**
* **Tailwind CSS**
* **Axios**
* **React Router**
* **React Markdown**
* **HTML5 / CSS3**

## 🏗️ Project Structure

```text
mediai-frontend/
│
├── public/
│   └── robo.png
│
├── src/
│   ├── pages/
│   │   ├── AIAssistant.jsx
│   │   ├── AppointmentPreparation.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── HealthJournal.jsx
│   │   ├── HealthTopics.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Reminders.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.mjs
```

## 🔗 Backend Integration

The frontend communicates with the MediAI backend through REST APIs using **Axios**.

Main backend modules include:

```text
Authentication
AI Assistant
Chat
Reminders
Documents
Health Journal
User Profile
```

The frontend API base URL is configured using an environment variable:

```env
VITE_API_URL=your_backend_api_url
```

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/himayahict/mediai-frontend.git
```

Navigate to the project:

```bash
cd mediai-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🔐 Environment Variables

Environment variables are used for API configuration.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> `.env` files are excluded from version control to protect environment-specific configuration and secrets.

## 🎯 Project Purpose

MediAI was developed as a practical **AI + Full-Stack Web Application** project, combining modern frontend development, REST API integration, authentication, database-driven features, and AI-powered functionality.

The project demonstrates practical skills in:

* Frontend development
* React application architecture
* API integration
* Authentication flows
* State management
* Responsive UI development
* AI integration
* Full-stack application development

## ⚠️ Disclaimer

MediAI provides general healthcare information and educational support. It is **not intended to provide medical diagnosis, prescribe medication, or replace professional medical advice**.

For urgent or emergency situations, users should contact an appropriate healthcare professional or emergency service.

## 👩‍💻 Developer

**Sasini Himaya Imbulana**

BHSc (Hons) Health Information and Communication Technology
UI/UX Designer | HICT Undergraduate | Front-End Developer

GitHub: **@himayahict**
