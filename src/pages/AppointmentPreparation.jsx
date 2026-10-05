import { useState, useEffect } from "react";
const AppointmentPreparation = () => {
  const [appointment, setAppointment] = useState({
    date: "",
    doctor: "",
    hospital: "",
    reason: "",
  });

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("mediAI_appointment_questions");

    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);

      setSelectedQuestions(parsedQuestions);
      setSavedQuestions(parsedQuestions);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateQuestions = async () => {
    if (!appointment.reason.trim()) {
      alert("Please enter the reason for your appointment.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
I have an upcoming medical appointment.

Reason for appointment:
${appointment.reason}

Generate 5 useful questions that I can ask my doctor during this appointment.

Important:
- Questions should be simple and easy to understand.
- Questions should be relevant to the reason for the appointment.
- Do not diagnose me.
- Do not provide treatment or medication instructions.
- Return ONLY the 5 questions as a numbered list.
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate questions.");
      }

      const aiText = data.aiResponse;

      const generatedQuestions = aiText
        .split("\n")
        .map((line) =>
          line
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .replace(/^\s*[-•]\s*/, "")
            .trim(),
        )
        .filter((line) => line.length > 0)
        .slice(0, 5);

      setQuestions(generatedQuestions);
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Generate questions error:", error);

      alert("Unable to generate questions right now. Please try again.");
    }
  };

  const handleQuestionToggle = (question) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(question)) {
        return prev.filter((item) => item !== question);
      }

      return [...prev, question];
    });
  };

  const handleSaveQuestions = () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    localStorage.setItem(
      "mediAI_appointment_questions",
      JSON.stringify(selectedQuestions),
    );

    setSavedQuestions(selectedQuestions);

    alert("Questions saved successfully!");
  };

  const handleClearSavedQuestions = () => {
    localStorage.removeItem("mediAI_appointment_questions");

    setSavedQuestions([]);
    setSelectedQuestions([]);

    alert("Saved questions cleared.");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ap-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(135deg, #eef4ff 0%, #f7faff 40%, #eaf1ff 100%);
          color: #0f172a;
        }

        /* ---------- Animated background ---------- */
        .ap-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .ap-hex {
          position: absolute;
          width: 220px;
          height: 220px;
          background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(99,102,241,0.05));
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          animation: ap-float 18s ease-in-out infinite;
          filter: blur(0.4px);
        }
        .ap-hex.h1 { top: -60px;  left: -80px;  animation-delay: 0s;   }
        .ap-hex.h2 { top: 20%;     right: -100px; animation-delay: -3s;  width: 300px; height: 300px; opacity: 0.8; }
        .ap-hex.h3 { bottom: -80px; left: 15%;   animation-delay: -6s;  width: 260px; height: 260px; }
        .ap-hex.h4 { top: 55%;     left: -70px;  animation-delay: -9s;  width: 180px; height: 180px; opacity: 0.7; }
        .ap-hex.h5 { bottom: 10%;  right: 8%;    animation-delay: -12s; width: 200px; height: 200px; opacity: 0.6; }

        @keyframes ap-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-30px) rotate(8deg); }
        }

        .ap-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
          animation: ap-pulse 10s ease-in-out infinite;
        }
        .ap-blob.b1 { width: 380px; height: 380px; background: #bfdbfe; top: 5%; left: 10%; }
        .ap-blob.b2 { width: 320px; height: 320px; background: #c7d2fe; bottom: 10%; right: 10%; animation-delay: -4s; }
        .ap-blob.b3 { width: 260px; height: 260px; background: #a5f3fc; top: 40%; right: 30%; animation-delay: -7s; }

        @keyframes ap-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.15); opacity: 0.75; }
        }

        /* ---------- Layout ---------- */
        .ap-container {
          position: relative;
          z-index: 1;
          max-width: 1080px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* ---------- Header ---------- */
        .ap-header {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 34px;
          animation: ap-fadeUp 0.7s ease both;
        }

        .ap-title-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ap-logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 10px 24px rgba(59,130,246,0.35);
          animation: ap-glow 3s ease-in-out infinite;
        }
        @keyframes ap-glow {
          0%, 100% { box-shadow: 0 10px 24px rgba(59,130,246,0.35); }
          50%      { box-shadow: 0 10px 34px rgba(99,102,241,0.55); }
        }

        .ap-title {
          margin: 0;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
        }

        .ap-subtitle {
          color: #64748b;
          font-size: 15.5px;
          margin: 0;
          max-width: 680px;
          line-height: 1.65;
        }

        /* ---------- Card ---------- */
        .ap-card {
          position: relative;
          padding: 34px;
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 24px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 50px rgba(59,130,246,0.14);
          animation: ap-fadeUp 0.8s ease both;
          animation-delay: 0.1s;
          overflow: hidden;
        }
        .ap-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #6366f1, #06b6d4);
          border-radius: 24px 24px 0 0;
        }

        .ap-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 26px;
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .ap-card-title svg {
          color: #2563eb;
        }

        /* ---------- Form ---------- */
        .ap-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .ap-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ap-field-full { grid-column: 1 / -1; }

        .ap-label {
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ap-label::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .ap-input,
        .ap-textarea {
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
          outline: none;
          transition: all 0.3s ease;
        }
        .ap-input::placeholder,
        .ap-textarea::placeholder {
          color: #94a3b8;
        }
        .ap-input:hover,
        .ap-textarea:hover {
          border-bottom-color: rgba(59,130,246,0.35);
        }
        .ap-input:focus,
        .ap-textarea:focus {
          border-bottom-color: #2563eb;
          box-shadow: 0 6px 12px -8px rgba(59,130,246,0.5);
        }

        .ap-textarea {
          min-height: 90px;
          resize: vertical;
          padding-top: 8px;
          line-height: 1.6;
        }

        /* date input calendar icon recolor (webkit) */
        .ap-input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(31%) sepia(94%) saturate(2150%) hue-rotate(212deg) brightness(96%) contrast(93%);
          opacity: 0.85;
        }

        /* ---------- Primary button ---------- */
        .ap-generate-btn {
          margin-top: 28px;
          width: 100%;
          padding: 15px 22px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 26px rgba(59,130,246,0.35);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .ap-generate-btn::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s ease;
        }
        .ap-generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(99,102,241,0.45);
        }
        .ap-generate-btn:hover::after { left: 100%; }
        .ap-generate-btn:active { transform: translateY(0); }

        /* ---------- Save button (secondary) ---------- */
        .ap-save-btn {
           display: inline-flex;
           align-items: center;
           justify-content: center;
           gap: 10px;
           margin-top: 22px;
           padding: 14px 22px;
           border: 1.5px solid rgba(59,130,246,0.35);
           border-radius: 13px;
           background: rgba(255,255,255,0.9);
           color: #1e40af;
           font-size: 14px;
           font-weight: 700;
           font-family: inherit;
           letter-spacing: 0.01em;
           cursor: pointer;
           position: relative;
           overflow: hidden;
           transition: all 0.3s cubic-bezier(.2,.8,.2,1);
           box-shadow: 0 4px 14px rgba(59,130,246,0.08);
        }
        .ap-save-btn svg {
           transition: transform 0.3s ease;
           filter: drop-shadow(0 0 4px rgba(59,130,246,0.25));
        }
        .ap-save-btn:hover {
           background: linear-gradient(135deg, #3b82f6, #6366f1);
           color: #ffffff;
           border-color: transparent;
           transform: translateY(-2px);
           box-shadow: 0 12px 28px rgba(59,130,246,0.35);
        }
        .ap-save-btn:hover svg {
           transform: scale(1.1) translateY(-1px);
        }
        .ap-save-btn:hover svg path,
        .ap-save-btn:hover svg rect,
        .ap-save-btn:hover svg circle {
           stroke: #ffffff;
           fill: rgba(255,255,255,0.15);
        }
        .ap-save-btn:hover svg circle[fill="#3b82f6"] {
           fill: #ffffff;
        }
        .ap-save-btn:active {
           transform: translateY(0);
           box-shadow: 0 6px 16px rgba(59,130,246,0.25);
        }

        /* ---------- Questions panel ---------- */
        .ap-questions {
          margin-top: 30px;
          padding: 26px;
          border: 1px solid rgba(59,130,246,0.16);
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(219,234,254,0.5) 0%, rgba(224,231,255,0.35) 100%);
          animation: ap-fadeUp 0.6s ease both;
          position: relative;
          overflow: hidden;
        }
        .ap-questions::before {
          content: "";
          position: absolute;
          top: -40%;
          right: -15%;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%);
          pointer-events: none;
        }

        .ap-questions-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 18px;
          font-size: 17px;
          font-weight: 800;
          color: #1e40af;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 1;
        }
        .ap-questions-title svg {
          filter: drop-shadow(0 0 6px rgba(59,130,246,0.45));
          animation: ap-bulb-glow 2.5s ease-in-out infinite;
        }
        @keyframes ap-bulb-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.35)); }
          50%      { filter: drop-shadow(0 0 12px rgba(99,102,241,0.75)); }
        }

        .ap-question-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .ap-question {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid rgba(59,130,246,0.14);
          border-radius: 14px;
          background: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(.2,.8,.2,1);
          animation: ap-fadeUp 0.5s ease both;
        }
        .ap-question:hover {
          border-color: rgba(59,130,246,0.4);
          background: #ffffff;
          transform: translateX(4px);
          box-shadow: 0 8px 22px rgba(59,130,246,0.14);
        }

        /* Custom circular checkbox */
        .ap-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 50%;
          border: 2px solid rgba(59,130,246,0.35);
          background: #ffffff;
          cursor: pointer;
          position: relative;
          transition: all 0.25s ease;
          margin: 0;
        }
        .ap-checkbox:hover {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        .ap-checkbox:checked {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(59,130,246,0.35);
        }
        .ap-checkbox:checked::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 45%;
          width: 5px;
          height: 10px;
          border: solid #ffffff;
          border-width: 0 2.4px 2.4px 0;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .ap-question-text {
          font-size: 14px;
          line-height: 1.55;
          color: #374151;
          font-weight: 500;
        }
        .ap-question input:checked + .ap-question-text {
          color: #94a3b8;
          text-decoration: line-through;
        }

        /* ---------- Animations ---------- */
        @keyframes ap-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Stagger question list */
        .ap-question:nth-child(1) { animation-delay: 0.05s; }
        .ap-question:nth-child(2) { animation-delay: 0.10s; }
        .ap-question:nth-child(3) { animation-delay: 0.15s; }
        .ap-question:nth-child(4) { animation-delay: 0.20s; }
        .ap-question:nth-child(5) { animation-delay: 0.25s; }
        .ap-question:nth-child(6) { animation-delay: 0.30s; }

        /* ---------- Responsive ---------- */
        @media (max-width: 640px) {
          .ap-container { padding: 28px 16px 60px; }
          .ap-title { font-size: 27px; }
          .ap-logo { width: 44px; height: 44px; }
          .ap-card { padding: 24px; border-radius: 20px; }
          .ap-form-grid { grid-template-columns: 1fr; gap: 18px; }
          .ap-field-full { grid-column: auto; }
          .ap-questions { padding: 20px; }
          .ap-questions-title { font-size: 15.5px; }
          .ap-question { padding: 12px 14px; }
        }
        .ap-saved-section {
          margin-top: 24px;
          padding: 24px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(59, 130, 246, 0.16);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }
        .ap-saved-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 18px;
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 800;
        }
        .ap-saved-title svg {
          width: 21px;
          height: 21px;
        }
        .ap-saved-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ap-saved-question {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
          line-height: 1.6;
        }
        .ap-saved-check {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          font-size: 13px;
          font-weight: 800;
        }
        .ap-clear-btn {
          margin-top: 18px;
          padding: 11px 18px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          background: rgba(254, 242, 242, 0.9);
          color: #dc2626;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .ap-clear-btn:hover {
          background: #fee2e2;
          border-color: #ef4444;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="ap-root">
        {/* Animated background */}
        <div className="ap-bg" aria-hidden="true">
          <div className="ap-blob b1" />
          <div className="ap-blob b2" />
          <div className="ap-blob b3" />
          <div className="ap-hex h1" />
          <div className="ap-hex h2" />
          <div className="ap-hex h3" />
          <div className="ap-hex h4" />
          <div className="ap-hex h5" />
        </div>

        <main className="ap-container">
          {/* Header */}
          <header className="ap-header">
            <div className="ap-title-row">
              <div className="ap-logo">
                <CalendarIcon />
              </div>
              <h1 className="ap-title">Appointment Preparation</h1>
            </div>

            <p className="ap-subtitle">
              Prepare for your doctor appointment by organizing your information
              and creating useful questions to discuss.
            </p>
          </header>

          {/* Card */}
          <section className="ap-card">
            <h2 className="ap-card-title">
              <ClipboardIcon />
              Upcoming Appointment
            </h2>

            <div className="ap-form-grid">
              <div className="ap-field">
                <label className="ap-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  className="ap-input"
                />
              </div>

              <div className="ap-field">
                <label className="ap-label">Doctor</label>
                <input
                  type="text"
                  name="doctor"
                  value={appointment.doctor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Silva"
                  className="ap-input"
                />
              </div>

              <div className="ap-field ap-field-full">
                <label className="ap-label">Hospital / Clinic</label>
                <input
                  type="text"
                  name="hospital"
                  value={appointment.hospital}
                  onChange={handleChange}
                  placeholder="e.g. ABC Hospital"
                  className="ap-input"
                />
              </div>

              <div className="ap-field ap-field-full">
                <label className="ap-label">Reason for Appointment</label>
                <textarea
                  name="reason"
                  value={appointment.reason}
                  onChange={handleChange}
                  placeholder="Describe the main reason for your appointment..."
                  className="ap-textarea"
                />
              </div>
            </div>

            <button
              className="ap-generate-btn"
              onClick={handleGenerateQuestions}
            >
              <SparkleIcon />
              Generate Questions
            </button>

            {questions.length > 0 && (
              <div className="ap-questions">
                <h3 className="ap-questions-title">
                  <BulbIcon />
                  Suggested Questions
                </h3>

                <div className="ap-question-list">
                  {questions.map((question) => (
                    <label key={question} className="ap-question">
                      <input
                        type="checkbox"
                        className="ap-checkbox"
                        checked={selectedQuestions.includes(question)}
                        onChange={() => handleQuestionToggle(question)}
                      />
                      <span className="ap-question-text">{question}</span>
                    </label>
                  ))}
                </div>

                <button className="ap-save-btn" onClick={handleSaveQuestions}>
                  <SaveIcon />
                  Save Selected Questions
                </button>
              </div>
            )}
            {savedQuestions.length > 0 && (
              <div className="ap-saved-section">
                <h3 className="ap-saved-title">
                  <SaveIcon />
                  Saved Questions
                </h3>

                <div className="ap-saved-list">
                  {savedQuestions.map((question, index) => (
                    <div className="ap-saved-question" key={index}>
                      <span className="ap-saved-check">✓</span>
                      <span>{question}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="ap-clear-btn"
                  onClick={handleClearSavedQuestions}
                >
                  Clear Saved Questions
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

/* ---------- Icons ---------- */
const CalendarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M8 2v4M16 2v4M3 10h18" />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 4h6a2 2 0 0 1 2 2v0h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1v0a2 2 0 0 1 2-2z" />
    <path d="M9 4v2h6V4" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M12 2l1.9 5.8L19.7 9.7 13.9 11.6 12 17.4 10.1 11.6 4.3 9.7 10.1 7.8 12 2z"
      opacity="0.95"
    />
    <path
      d="M19 14l.9 2.6L22.5 17.5 19.9 18.4 19 21l-.9-2.6L15.5 17.5 18.1 16.6 19 14z"
      opacity="0.7"
    />
  </svg>
);

const BulbIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2563eb"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path
      d="M12 3a6 6 0 0 0-4 10.5c.7.7 1.2 1.5 1.5 2.5h5c.3-1 .8-1.8 1.5-2.5A6 6 0 0 0 12 3z"
      fill="rgba(59,130,246,0.12)"
      stroke="#3b82f6"
    />
    <path d="M12 8v3" stroke="#6366f1" strokeWidth="2.2" />
  </svg>
);

const SaveIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Floppy disk body */}
    <path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke="#3b82f6"
      fill="rgba(59,130,246,0.10)"
    />
    {/* Top notch */}
    <path d="M17 3v5H8V3" stroke="#2563eb" />
    {/* Bottom label */}
    <rect
      x="7"
      y="13"
      width="10"
      height="8"
      rx="1"
      stroke="#6366f1"
      fill="rgba(99,102,241,0.10)"
    />
    {/* Small dot */}
    <circle cx="12" cy="16" r="0.9" fill="#3b82f6" stroke="none" />
  </svg>
);

export default AppointmentPreparation;
