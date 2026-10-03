import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import HealthTopics from "./pages/HealthTopics";
import AppointmentPreparation from "./pages/AppointmentPreparation";
import Reminders from "./pages/Reminders";
import Documents from "./pages/Documents"
import HealthJournal from "./pages/HealthJournal";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/ai-assistant" element={<AIAssistant />} />

        <Route path="/health-topics" element={<HealthTopics />} />

        <Route path="/appointments" element={<AppointmentPreparation />}/>

        <Route path="/reminders" element={<Reminders />} />

        <Route path="/documents" element={<Documents />} />

         <Route path="/health-journal" element={<HealthJournal />} />

         <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
