import { useState, useEffect } from "react";
import axios from "axios";

const Reminders = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "Medication",
    date: "",
    time: "",
    repeat: "None",
  });

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reminders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Reminders API response:", response.data);

      setReminders(response.data.reminders || []);
    } catch (error) {
      console.error("Fetch reminders error:", error);

      setError(error.response?.data?.message || "Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingReminder) {
        // UPDATE REMINDER
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/reminders/${editingReminder._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Update reminder response:", response.data);

        setReminders((prev) =>
          prev.map((reminder) =>
            reminder._id === editingReminder._id
              ? response.data.reminder
              : reminder,
          ),
        );

        setEditingReminder(null);
      } else {
        // CREATE REMINDER
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/reminders`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Create reminder response:", response.data);

        setReminders((prev) => [...prev, response.data.reminder]);
      }

      setShowForm(false);

      setFormData({
        title: "",
        type: "Medication",
        date: "",
        time: "",
        repeat: "None",
      });
    } catch (error) {
      console.error("Save reminder error:", error);

      alert(error.response?.data?.message || "Failed to save reminder");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reminders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Delete reminder response:", response.data);

      setReminders((prev) => prev.filter((reminder) => reminder._id !== id));
    } catch (error) {
      console.error("Delete reminder error:", error);

      alert(error.response?.data?.message || "Failed to delete reminder");
    }
  };

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/reminders/${id}/status`,
        {
          status: "Completed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Complete reminder response:", response.data);

      setReminders((prev) =>
        prev.map((reminder) =>
          reminder._id === id ? response.data.reminder : reminder,
        ),
      );
    } catch (error) {
      console.error("Complete reminder error:", error);

      alert(error.response?.data?.message || "Failed to complete reminder");
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);

    setFormData({
      title: reminder.title,
      type: reminder.type,
      date: reminder.date,
      time: reminder.time,
      repeat: reminder.repeat,
    });

    setShowForm(true);
  };

  // ===== Blue SVG Icons =====
  const Icons = {
    pill: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m10.5 20.5 10-10a5 5 0 0 0-7-7l-10 10a5 5 0 0 0 7 7z" />
        <path d="m8.5 8.5 7 7" />
      </svg>
    ),
    plus: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    bell: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3V8z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    ),
    edit: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    trash: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
    close: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    clock: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    calendar: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </svg>
    ),
    water: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.5s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
        <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" opacity="0.55" />
      </svg>
    ),
    activity: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    stethoscope: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 3v6a5 5 0 0 0 10 0V3" />
        <path d="M9 14v2a5 5 0 0 0 10 0v-2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
    note: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M15 3v5h5" />
        <path d="M8 13h8M8 17h6" />
      </svg>
    ),
    check: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Water":
        return Icons.water;
      case "Exercise":
        return Icons.activity;
      case "Appointment":
        return Icons.stethoscope;
      case "Other":
        return Icons.note;
      default:
        return Icons.pill;
    }
  };

  const activeReminders = reminders.filter(
    (reminder) => reminder.status === "Active",
  );

  const today = new Date().toISOString().split("T")[0];

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const todayReminders = reminders.filter(
    (reminder) => reminder.date === today,
  );

  const upcomingReminders = reminders
    .filter((reminder) => reminder.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="rm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .rm-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(135deg, #eef4ff 0%, #f7faff 40%, #eaf1ff 100%);
          color: #0f172a;
          padding: 40px 16px 80px;
        }

        /* ---------- Animated background ---------- */
        .rm-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .rm-hex {
          position: absolute;
          background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(99,102,241,0.05));
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          animation: rm-float 18s ease-in-out infinite;
        }
        .rm-hex.h1 { top: -60px;  left: -80px;  width: 220px; height: 220px; animation-delay: 0s;   }
        .rm-hex.h2 { top: 20%;     right: -100px; width: 300px; height: 300px; animation-delay: -3s; opacity: 0.8; }
        .rm-hex.h3 { bottom: -80px; left: 15%;   width: 260px; height: 260px; animation-delay: -6s; }
        .rm-hex.h4 { top: 55%;     left: -70px;  width: 180px; height: 180px; animation-delay: -9s; opacity: 0.7; }
        .rm-hex.h5 { bottom: 10%;  right: 8%;    width: 200px; height: 200px; animation-delay: -12s; opacity: 0.6; }

        @keyframes rm-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-30px) rotate(8deg); }
        }

        .rm-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
          animation: rm-pulse 10s ease-in-out infinite;
        }
        .rm-blob.b1 { width: 380px; height: 380px; background: #bfdbfe; top: 5%; left: 10%; }
        .rm-blob.b2 { width: 320px; height: 320px; background: #c7d2fe; bottom: 10%; right: 10%; animation-delay: -4s; }
        .rm-blob.b3 { width: 260px; height: 260px; background: #a5f3fc; top: 40%; right: 30%; animation-delay: -7s; }

        @keyframes rm-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.15); opacity: 0.75; }
        }

        .rm-wrapper {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
        }

        /* ---------- Header ---------- */
        .rm-header {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 34px;
          animation: rm-fadeUp 0.7s ease both;
        }
        @media (min-width: 640px) {
          .rm-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .rm-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .rm-logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 10px 24px rgba(59,130,246,0.35);
          animation: rm-glow 3s ease-in-out infinite;
        }
        .rm-logo svg { width: 26px; height: 26px; }

        @keyframes rm-glow {
          0%, 100% { box-shadow: 0 10px 24px rgba(59,130,246,0.35); }
          50%      { box-shadow: 0 10px 34px rgba(99,102,241,0.55); }
        }

        .rm-title {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
        }
        .rm-subtitle {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        /* ---------- Add Button ---------- */
        .rm-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 22px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.01em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(.2,.8,.2,1);
          box-shadow: 0 10px 26px rgba(59,130,246,0.35);
        }
        .rm-add-btn svg { width: 16px; height: 16px; transition: transform 0.35s ease; }
        .rm-add-btn::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s ease;
        }
        .rm-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(99,102,241,0.45);
        }
        .rm-add-btn:hover svg { transform: rotate(90deg); }
        .rm-add-btn:hover::after { left: 100%; }
        .rm-add-btn:active { transform: translateY(0); }

        /* ---------- Section header ---------- */
        .rm-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          animation: rm-fadeUp 0.7s ease both;
          animation-delay: 0.05s;
        }
        .rm-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .rm-section-title svg {
          width: 20px;
          height: 20px;
          color: #3b82f6;
        }

        .rm-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #1e40af;
          background: rgba(59,130,246,0.10);
          border: 1px solid rgba(59,130,246,0.22);
        }
        .rm-count::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.22);
        }

        /* ---------- Panels (loading / error / empty) ---------- */
        .rm-panel {
          position: relative;
          z-index: 1;
          border-radius: 22px;
          padding: 44px 26px;
          text-align: center;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 20px 50px rgba(59,130,246,0.14);
          animation: rm-fadeUp 0.6s ease both;
          overflow: hidden;
        }
        .rm-panel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #6366f1, #06b6d4);
        }

        .rm-panel-text {
          margin: 0;
          color: #64748b;
          font-size: 15px;
          font-weight: 600;
        }
        .rm-panel-error {
          margin: 0;
          color: #dc2626;
          font-size: 15px;
          font-weight: 700;
        }

        .rm-spinner {
          width: 42px;
          height: 42px;
          margin: 0 auto 14px;
          border-radius: 50%;
          border: 3px solid rgba(59,130,246,0.18);
          border-top-color: #3b82f6;
          animation: rm-spin 0.9s linear infinite;
        }
        @keyframes rm-spin {
          to { transform: rotate(360deg); }
        }

        /* ---------- Empty state ---------- */
        .rm-empty-icon {
          width: 82px;
          height: 82px;
          margin: 0 auto 18px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #e0edff 0%, #eef4ff 100%);
          box-shadow: inset 0 0 0 1px rgba(59,130,246,0.14), 0 12px 28px rgba(59,130,246,0.18);
          color: #2563eb;
          animation: rm-empty-glow 3s ease-in-out infinite;
        }
        .rm-empty-icon svg { width: 42px; height: 42px; }

        @keyframes rm-empty-glow {
          0%, 100% { box-shadow: inset 0 0 0 1px rgba(59,130,246,0.14), 0 12px 28px rgba(59,130,246,0.18); }
          50%      { box-shadow: inset 0 0 0 1px rgba(59,130,246,0.28), 0 12px 40px rgba(99,102,241,0.42); }
        }

        .rm-empty-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .rm-empty-sub {
          margin: 6px 0 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        /* ---------- List ---------- */
        .rm-list {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rm-item {
          position: relative;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 20px;
          padding: 20px 22px;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s ease, border-color 0.35s ease;
          box-shadow: 0 6px 22px rgba(59,130,246,0.08);
          animation: rm-fadeUp 0.6s ease both;
        }
        .rm-item::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #3b82f6, #6366f1, #06b6d4);
          opacity: 0.9;
          transition: width 0.3s ease;
        }
        .rm-item::after {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(59,130,246,0.12), transparent 55%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .rm-item:hover {
          transform: translateY(-4px);
          border-color: rgba(59,130,246,0.32);
          box-shadow: 0 18px 40px rgba(59,130,246,0.20);
        }
        .rm-item:hover::after { opacity: 1; }
        .rm-item:hover::before { width: 6px; }

        .rm-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) {
          .rm-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .rm-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .rm-type-icon {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #e0edff 0%, #eef4ff 100%);
          box-shadow: inset 0 0 0 1px rgba(59,130,246,0.14), 0 6px 16px rgba(59,130,246,0.10);
          color: #2563eb;
          transition: transform 0.35s cubic-bezier(.2,.8,.2,1), background 0.35s ease;
        }
        .rm-type-icon svg { width: 26px; height: 26px; }
        .rm-item:hover .rm-type-icon {
          transform: scale(1.08) rotate(-4deg);
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
        }

        .rm-info { min-width: 0; 
        }

        .rm-item-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rm-item-meta {
          margin: 4px 0 0;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rm-item-meta svg {
          width: 13px;
          height: 13px;
          color: #3b82f6;
        }
        .rm-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .rm-meta-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .rm-time-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #1e40af;
          background: rgba(59,130,246,0.10);
          border: 1px solid rgba(59,130,246,0.18);
        }
        .rm-time-chip svg { width: 13px; height: 13px; }

        /* ---------- Status Badge ---------- */
        .rm-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          margin-left: 2px;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
          border: 1px solid rgba(34,197,94,0.20);
          background: rgba(34,197,94,0.10);
          color: #15803d;
        }

        .rm-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }

        /* Completed */
        .rm-status-badge.completed {
          background: rgba(100,116,139,0.10);
          border-color: rgba(100,116,139,0.20);
          color: #475569;
        }

        .rm-status-badge.completed .rm-status-dot {
          background: #64748b;
        }

         /* Cancelled */
        .rm-status-badge.cancelled {
          background: rgba(239,68,68,0.10);
          border-color: rgba(239,68,68,0.20);
          color: #dc2626;
        }

        .rm-status-badge.cancelled .rm-status-dot {
          background: #ef4444;
        }

        /* ---------- Action buttons ---------- */
        .rm-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .rm-actions { width: 100%; }
        }

        .rm-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(.2,.8,.2,1);
          letter-spacing: 0.01em;
        }
        .rm-btn svg { width: 14px; height: 14px; transition: transform 0.3s ease; }
        @media (max-width: 640px) {
          .rm-btn { flex: 1; justify-content: center; }
        }

        .rm-btn-edit {
          border: 1.5px solid rgba(59,130,246,0.30);
          background: rgba(255,255,255,0.9);
          color: #1e40af;
          box-shadow: 0 4px 14px rgba(59,130,246,0.08);
        }
        .rm-btn-edit:hover {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(59,130,246,0.35);
        }
        .rm-btn-edit:hover svg { transform: rotate(-12deg) scale(1.1); }

        .rm-btn-delete {
          border: 1.5px solid rgba(239,68,68,0.28);
          background: rgba(255,255,255,0.9);
          color: #dc2626;
          box-shadow: 0 4px 14px rgba(239,68,68,0.06);
        }
        .rm-btn-delete:hover {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(239,68,68,0.32);
        }
        .rm-btn-delete:hover svg { transform: scale(1.1) translateY(-1px); }

        .rm-btn-complete {
          background: rgba(34, 197, 94, 0.10);
          color: #15803d;
          border: 1px solid rgba(34, 197, 94, 0.20);
        }
        .rm-btn-complete:hover {
          background: rgba(34, 197, 94, 0.18);
          border-color: rgba(34, 197, 94, 0.35);
        }

        .rm-btn:active { transform: translateY(0); }

        /* ---------- Modal ---------- */
        .rm-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(6px);
          animation: rm-fadeIn 0.3s ease both;
        }

        .rm-modal {
          width: 100%;
          max-width: 520px;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          border-radius: 26px;
          background: rgba(255,255,255,0.98);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 30px 80px -20px rgba(59,130,246,0.45);
          animation: rm-fadeUp 0.4s ease both;
          overflow-x: hidden;
        }
        .rm-modal::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #6366f1, #06b6d4);
        }

        .rm-modal-hex {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.06));
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          animation: rm-float 12s ease-in-out infinite;
          pointer-events: none;
        }

        .rm-modal-head {
          position: relative;
          padding: 24px 24px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rm-modal-head-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .rm-modal-logo {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 8px 22px rgba(59,130,246,0.35);
        }
        .rm-modal-logo svg { width: 22px; height: 22px; }
        .rm-modal-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .rm-modal-sub {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: #64748b;
        }

        .rm-close-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.25s ease;
        }
        .rm-close-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
        .rm-close-btn:hover {
          color: #3b82f6;
          background: rgba(59,130,246,0.10);
        }
        .rm-close-btn:hover svg { transform: rotate(90deg); }

        .rm-form {
          position: relative;
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rm-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rm-label {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rm-label::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .rm-input,
        .rm-select {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 4px;
          border: none;
          border-bottom: 2px solid rgba(59,130,246,0.18);
          border-radius: 0;
          background: transparent;
          color: #0f172a;
          font-size: 14.5px;
          font-family: inherit;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease;
        }
        .rm-input::placeholder { color: #94a3b8; }
        .rm-input:hover,
        .rm-select:hover { border-bottom-color: rgba(59,130,246,0.35); }
        .rm-input:focus,
        .rm-select:focus {
          border-bottom-color: #2563eb;
          box-shadow: 0 6px 12px -8px rgba(59,130,246,0.5);
        }

        .rm-select {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #3b82f6 50%),
                            linear-gradient(135deg, #3b82f6 50%, transparent 50%);
          background-position: calc(100% - 12px) 50%, calc(100% - 6px) 50%;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 28px;
        }
        .rm-select option {
          background: #ffffff;
          color: #0f172a;
        }

        .rm-input[type="date"]::-webkit-calendar-picker-indicator,
        .rm-input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(31%) sepia(94%) saturate(2150%) hue-rotate(212deg) brightness(96%) contrast(93%);
          opacity: 0.85;
        }

        .rm-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          .rm-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .rm-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 8px;
        }

        .rm-cancel-btn {
          padding: 12px 20px;
          border-radius: 12px;
          border: 1.5px solid rgba(148,163,184,0.35);
          background: rgba(255,255,255,0.9);
          color: #475569;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .rm-cancel-btn:hover {
          background: #f8fafc;
          border-color: rgba(148,163,184,0.6);
          transform: translateY(-1px);
        }

        .rm-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.01em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(.2,.8,.2,1);
          box-shadow: 0 10px 26px rgba(59,130,246,0.35);
        }
        .rm-save-btn svg { width: 15px; height: 15px; transition: transform 0.3s ease; }
        .rm-save-btn::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s ease;
        }
        .rm-save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(99,102,241,0.45);
        }
        .rm-save-btn:hover svg { transform: translateX(3px) scale(1.1); }
        .rm-save-btn:hover::after { left: 100%; }
        .rm-save-btn:active { transform: translateY(0); }

        /* ---------- Animations ---------- */
        @keyframes rm-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rm-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .rm-item:nth-child(1) { animation-delay: 0.05s; }
        .rm-item:nth-child(2) { animation-delay: 0.10s; }
        .rm-item:nth-child(3) { animation-delay: 0.15s; }
        .rm-item:nth-child(4) { animation-delay: 0.20s; }
        .rm-item:nth-child(5) { animation-delay: 0.25s; }
        .rm-item:nth-child(6) { animation-delay: 0.30s; }
        .rm-item:nth-child(7) { animation-delay: 0.35s; }
        .rm-item:nth-child(8) { animation-delay: 0.40s; }

        @media (max-width: 640px) {
          .rm-root { padding: 24px 14px 60px; }
          .rm-title { font-size: 24px; }
          .rm-logo { width: 46px; height: 46px; }
          .rm-item { padding: 16px; }
          .rm-type-icon { width: 48px; height: 48px; border-radius: 14px; }
          .rm-type-icon svg { width: 22px; height: 22px; }
          .rm-item-title { font-size: 15px; }
        }
          .rm-empty {
            padding: 50px 20px;
            text-align: center;
            border: 1px dashed rgba(100, 116, 139, 0.25);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.45);
        }
          .rm-empty-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            background: rgba(99, 102, 241, 0.10);
            color: #6366f1;
        }
          .rm-empty-icon svg {
            width: 24px;
            height: 24px;
        }
          .rm-empty h3 {
            margin: 0 0 6px;
            font-size: 17px;
            font-weight: 700;
            color: #334155;
        }
          .rm-empty p {
            margin: 0;
            font-size: 13px;
            color: #64748b;
        }
          .rm-upcoming-section {
            margin-top: 42px;
            animation: rm-fadeUp 0.7s ease both;
        }
          .rm-upcoming-head {
            margin-bottom: 18px;
        }
      `}</style>

      {/* Animated background */}
      <div className="rm-bg" aria-hidden="true">
        <div className="rm-blob b1" />
        <div className="rm-blob b2" />
        <div className="rm-blob b3" />
        <div className="rm-hex h1" />
        <div className="rm-hex h2" />
        <div className="rm-hex h3" />
        <div className="rm-hex h4" />
        <div className="rm-hex h5" />
      </div>

      <div className="rm-wrapper">
        {/* ============ HEADER ============ */}
        <header className="rm-header">
          <div className="rm-header-left">
            <div className="rm-logo">{Icons.bell}</div>
            <div>
              <h1 className="rm-title">Reminders</h1>
              <p className="rm-subtitle">Manage your daily health reminders</p>
            </div>
          </div>

          <button className="rm-add-btn" onClick={() => setShowForm(true)}>
            <span>{Icons.plus}</span>
            Add Reminder
          </button>
        </header>

        {/* ============ SECTION ============ */}
        <div className="rm-section-head">
          <h2 className="rm-section-title">
            {Icons.clock}
            Today's Reminders
          </h2>
          <span className="rm-count">{activeReminders.length}Active</span>
        </div>

        {/* ============ REMINDERS LIST ============ */}
        {loading ? (
          <div className="rm-panel">
            <div className="rm-spinner" />
            <p className="rm-panel-text">Loading reminders...</p>
          </div>
        ) : error ? (
          <div className="rm-panel">
            <p className="rm-panel-error">{error}</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="rm-panel">
            <div className="rm-empty-icon">{Icons.pill}</div>
            <h3 className="rm-empty-title">No reminders yet</h3>
            <p className="rm-empty-sub">Add your first health reminder.</p>
          </div>
        ) : (
          <div className="rm-list">
            {todayReminders.length === 0 && (
              <div className="rm-empty">
                <div className="rm-empty-icon">{Icons.clock}</div>

                <h3>No reminders for today</h3>

                <p>You don't have any reminders scheduled for today.</p>
              </div>
            )}
            {todayReminders.map((reminder) => (
              <div key={reminder._id} className="rm-item">
                <div className="rm-row">
                  <div className="rm-left">
                    <div className="rm-type-icon">
                      {getTypeIcon(reminder.type)}
                    </div>

                    <div className="rm-info">
                      <h3 className="rm-item-title">{reminder.title}</h3>

                      <p className="rm-item-meta">
                        <span className="rm-meta-chip">{reminder.type}</span>
                        <span className="rm-meta-dot" />
                        <span className="rm-meta-chip">{reminder.repeat}</span>
                      </p>

                      <span className="rm-time-chip">
                        {Icons.clock}
                        {reminder.time}
                      </span>

                      <span
                        className={`rm-status-badge ${reminder.status?.toLowerCase()}`}
                      >
                        <span className="rm-status-dot" />
                        {reminder.status || "Active"}
                      </span>
                    </div>
                  </div>

                  <div className="rm-actions">
                    {reminder.status === "Active" && (
                      <button
                        className="rm-btn rm-btn-complete"
                        onClick={() => handleComplete(reminder._id)}
                      >
                        {Icons.check}
                        Complete
                      </button>
                    )}

                    <button
                      className="rm-btn rm-btn-edit"
                      onClick={() => handleEdit(reminder)}
                    >
                      {Icons.edit}
                      Edit
                    </button>

                    <button
                      className="rm-btn rm-btn-delete"
                      onClick={() => handleDelete(reminder._id)}
                    >
                      {Icons.trash}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ UPCOMING REMINDERS ============ */}
        <div className="rm-upcoming-section">

          <div className="rm-section-head rm-upcoming-head">
            <h2 className="rm-section-title">
              {Icons.calendar}
              Upcoming Reminders
            </h2>

            <span className="rm-count">
              {upcomingReminders.length} Upcoming
            </span>
          </div>

          {upcomingReminders.length === 0 ? (
            <div className="rm-empty">
              <div className="rm-empty-icon">
                {Icons.calendar}
              </div>

              <h3>No upcoming reminders</h3>

              <p>You don't have any reminders scheduled for upcoming days.</p>
            </div>
          ) : (
            <div className="rm-list">

              {upcomingReminders.map((reminder) => (
                <div key={reminder._id} className="rm-item">

                  <div className="rm-row">

                    <div className="rm-left">

                      <div className="rm-type-icon">
                        {getTypeIcon(reminder.type)}
                      </div>

                      <div className="rm-info">

                        <h3 className="rm-item-title">
                          {reminder.title}
                        </h3>

                        <p className="rm-item-meta">

                          <span className="rm-meta-chip">
                            {reminder.type}
                          </span>

                          <span className="rm-meta-dot" />

                          <span className="rm-meta-chip">
                            {reminder.repeat}
                          </span>

                        </p>

                        <span className="rm-time-chip">
                          {Icons.calendar}
                          {reminder.date}
                        </span>

                        <span className="rm-time-chip">
                          {Icons.clock}
                          {reminder.time}
                        </span>

                        <span
                          className={`rm-status-badge ${reminder.status?.toLowerCase()}`}
                        >
                          <span className="rm-status-dot" />
                          {reminder.status || "Active"}
                        </span>

                      </div>

                    </div>

                    <div className="rm-actions">

                      {reminder.status === "Active" && (
                        <button
                          className="rm-btn rm-btn-complete"
                          onClick={() => handleComplete(reminder._id)}
                        >
                          {Icons.check}
                          Complete
                        </button>
                      )}

                      <button
                        className="rm-btn rm-btn-edit"
                        onClick={() => handleEdit(reminder)}
                      >
                        {Icons.edit}
                        Edit
                      </button>

                      <button
                        className="rm-btn rm-btn-delete"
                        onClick={() => handleDelete(reminder._id)}
                      >
                        {Icons.trash}
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* ============ MODAL ============ */}
        {showForm && (
          <div className="rm-modal-overlay">
            <div className="rm-modal">
              <div className="rm-modal-hex" />

              <div className="rm-modal-head">
                <div className="rm-modal-head-left">
                  <div className="rm-modal-logo">{Icons.plus}</div>
                  <div>
                    <h2 className="rm-modal-title">
                      {editingReminder ? "Edit Reminder" : "Add Reminder"}
                    </h2>
                    <p className="rm-modal-sub">
                      {editingReminder
                        ? "Update your reminder details"
                        : "Create a new health reminder"}
                    </p>
                  </div>
                </div>

                <button
                  className="rm-close-btn"
                  onClick={() => setShowForm(false)}
                  aria-label="Close"
                >
                  {Icons.close}
                </button>
              </div>

              <form className="rm-form" onSubmit={handleSubmit}>
                <div className="rm-field">
                  <label className="rm-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Vitamin D"
                    required
                    className="rm-input"
                  />
                </div>

                <div className="rm-field">
                  <label className="rm-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="rm-select"
                  >
                    <option value="Medication">Medication</option>
                    <option value="Water">Water</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="rm-grid-2">
                  <div className="rm-field">
                    <label className="rm-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="rm-input"
                    />
                  </div>

                  <div className="rm-field">
                    <label className="rm-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="rm-input"
                    />
                  </div>
                </div>

                <div className="rm-field">
                  <label className="rm-label">Repeat</label>
                  <select
                    name="repeat"
                    value={formData.repeat}
                    onChange={handleChange}
                    className="rm-select"
                  >
                    <option value="None">None</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div className="rm-modal-actions">
                  <button
                    type="button"
                    className="rm-cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="rm-save-btn">
                    Save Reminder
                    <span>{Icons.check}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
