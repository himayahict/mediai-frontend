import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const HealthJournal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showWeeklyOverview, setShowWeeklyOverview] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryPeriod, setAiSummaryPeriod] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState("");
  const [aiSummaryEntryCount, setAiSummaryEntryCount] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    note: "",
    category: "General",
    date: new Date().toISOString().split("T")[0],
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const API_URL = "http://localhost:5000/api/health-journal";

  // ===============================
  // ICONS
  // ===============================
  const Icons = {
    journal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    ),
    filter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    view: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  // ===============================
  // FETCH JOURNALS
  // ===============================
  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${userId}`);
      setJournals(response.data);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchJournals();
    } else {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const savedSummary = localStorage.getItem(`mediai_journal_ai_summary_${userId}`);
    if (savedSummary) {
      try {
        const parsedSummary = JSON.parse(savedSummary);
        setAiSummary(parsedSummary.summary || "");
        setAiSummaryPeriod(parsedSummary.period || null);
        setAiSummaryEntryCount(parsedSummary.entryCount || 0);
      } catch (error) {
        console.error("Failed to restore AI journal summary:", error);
        localStorage.removeItem(`mediai_journal_ai_summary_${userId}`);
      }
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJournal) {
        await axios.put(`${API_URL}/${editingJournal._id}`, formData);
      } else {
        await axios.post(API_URL, { ...formData, userId });
      }
      setFormData({
        title: "",
        note: "",
        category: "General",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingJournal(null);
      setShowForm(false);
      fetchJournals();
    } catch (error) {
      console.error("Failed to save journal:", error);
      alert("Failed to save journal entry.");
    }
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      note: journal.note,
      category: journal.category,
      date: journal.date ? new Date(journal.date).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this journal entry?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchJournals();
    } catch (error) {
      console.error("Failed to delete journal:", error);
      alert("Failed to delete journal entry.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJournal(null);
    setFormData({
      title: "",
      note: "",
      category: "General",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const generateAISummary = async (period) => {
    if (!userId) return;
    try {
      setAiLoading(true);
      setAiSummaryError("");
      setAiSummary("");
      setAiSummaryPeriod(null);
      setAiSummaryEntryCount(0);

      const response = await axios.post(`${API_URL}/ai-summary`, { userId, period });

      if (response.data?.success) {
        const summaryData = {
          summary: response.data.summary || "",
          period: response.data.period || period,
          entryCount: response.data.entryCount || 0,
        };
        setAiSummary(summaryData.summary);
        setAiSummaryPeriod(summaryData.period);
        setAiSummaryEntryCount(summaryData.entryCount);
        localStorage.setItem(`mediai_journal_ai_summary_${userId}`, JSON.stringify(summaryData));
      } else {
        setAiSummaryError("Unable to generate the AI summary. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate AI journal summary:", error);
      setAiSummaryError(
        error.response?.data?.message || "Failed to generate the AI journal summary. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ===============================
  // CATEGORY COLORS
  // ===============================
  const getCategoryColor = (category) => {
    const colors = {
      General: { bg: "#eff6ff", border: "rgba(59,130,246,0.20)", text: "#2563eb", icon: "#2563eb" },
      Symptoms: { bg: "#fef2f2", border: "rgba(239,68,68,0.20)", text: "#dc2626", icon: "#dc2626" },
      Sleep: { bg: "#f5f3ff", border: "rgba(139,92,246,0.20)", text: "#7c3aed", icon: "#7c3aed" },
      Nutrition: { bg: "#ecfdf5", border: "rgba(16,185,129,0.20)", text: "#059669", icon: "#059669" },
      Exercise: { bg: "#fff7ed", border: "rgba(249,115,22,0.20)", text: "#ea580c", icon: "#ea580c" },
      Mood: { bg: "#fdf2f8", border: "rgba(236,72,153,0.20)", text: "#db2777", icon: "#db2777" },
      Medication: { bg: "#ecfeff", border: "rgba(6,182,212,0.20)", text: "#0891b2", icon: "#0891b2" },
      Other: { bg: "#f8fafc", border: "rgba(100,116,139,0.20)", text: "#475569", icon: "#475569" },
    };
    return colors[category] || colors.General;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      General: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v16H4z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      ),
      Symptoms: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6m0 8v6m-6-10h6m6 0h-6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      Sleep: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      Nutrition: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <path d="M6 1v3M10 1v3M14 1v3" />
        </svg>
      ),
      Exercise: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l3-8 4 16 3-8h4" />
        </svg>
      ),
      Mood: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      ),
      Medication: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 9-9a4.95 4.95 0 0 0-7-7l-9 9a4.95 4.95 0 0 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      ),
      Other: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      ),
    };
    return icons[category] || icons.General;
  };

  // ===============================
  // FILTERED JOURNALS
  // ===============================
  const categories = ["All", "General", "Symptoms", "Sleep", "Nutrition", "Exercise", "Mood", "Medication", "Other"];

  const filteredJournals = journals
    .filter((j) => activeFilter === "All" || j.category === activeFilter)
    .filter(
      (j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.note.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categoryCounts = journals.reduce((acc, j) => {
    acc[j.category] = (acc[j.category] || 0) + 1;
    return acc;
  }, {});

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const weeklyDays = getLast7Days();

  const weeklyData = weeklyDays.map((day) => {
    const count = journals.filter((journal) => {
      const journalDate = new Date(journal.date);
      journalDate.setHours(0, 0, 0, 0);
      return journalDate.getTime() === day.getTime();
    }).length;
    return {
      date: day,
      count,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });

  const weeklyEntryCount = weeklyData.reduce((total, day) => total + day.count, 0);
  const weeklyActiveDays = weeklyData.filter((day) => day.count > 0).length;

  const weeklyTopCategory = (() => {
    const counts = {};
    journals.forEach((journal) => {
      const journalDate = new Date(journal.date);
      const today = new Date();
      const diffTime = today - journalDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        counts[journal.category] = (counts[journal.category] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "—";
  })();

  const maxWeeklyCount = Math.max(...weeklyData.map((day) => day.count), 1);

  // ===============================
  // NO USER
  // ===============================
  if (!userId) {
    return (
      <div className="journal-root">
        <style>{journalStyles}</style>
        <div className="journal-bg" aria-hidden="true">
          <div className="journal-blob b1" />
          <div className="journal-blob b2" />
          <div className="journal-blob b3" />
          <div className="journal-hex h1" />
          <div className="journal-hex h2" />
          <div className="journal-hex h3" />
        </div>
        <div className="journal-wrapper">
          <div className="journal-no-user">
            <div className="journal-empty-icon">{Icons.lock}</div>
            <h2 className="journal-empty-title">Access Restricted</h2>
            <p className="journal-empty-text">
              Please log in to use your Health Journal and track your daily wellness.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-root">
      <style>{journalStyles}</style>

      {/* ================= BACKGROUND ================= */}
      <div className="journal-bg" aria-hidden="true">
        <div className="journal-blob b1" />
        <div className="journal-blob b2" />
        <div className="journal-blob b3" />
        <div className="journal-hex h1" />
        <div className="journal-hex h2" />
        <div className="journal-hex h3" />
      </div>

      <div className="journal-wrapper">
        {/* ================= HEADER ================= */}
        <header className="journal-header">
          <div className="journal-header-left">
            <div className="journal-logo">{Icons.journal}</div>
            <div>
              <h1 className="journal-title">Health Journal</h1>
              <p className="journal-subtitle">Track your daily wellness journey</p>
            </div>
          </div>
          <button className="journal-primary-btn" onClick={() => setShowForm(true)}>
            {Icons.plus}
            Add Entry
          </button>
        </header>

        {/* ================= STATS ================= */}
        {!loading && journals.length > 0 && (
          <div className="journal-stats">
            <div className="journal-stat-card">
              <div className="journal-stat-icon blue">{Icons.journal}</div>
              <p className="journal-stat-value">{journals.length}</p>
              <p className="journal-stat-label">Total Entries</p>
            </div>
            <div className="journal-stat-card">
              <div className="journal-stat-icon green">{Icons.calendar}</div>
              <p className="journal-stat-value">
                {journals.filter((j) => new Date(j.date).toDateString() === new Date().toDateString()).length}
              </p>
              <p className="journal-stat-label">Today</p>
            </div>
            <div className="journal-stat-card">
              <div className="journal-stat-icon violet">{Icons.sparkle}</div>
              <p className="journal-stat-value">{Object.keys(categoryCounts).length}</p>
              <p className="journal-stat-label">Categories</p>
            </div>
            <div className="journal-stat-card">
              <div className="journal-stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v6m0 8v6m-6-10h6m6 0h-6" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <p className="journal-stat-value">{categoryCounts["Symptoms"] || 0}</p>
              <p className="journal-stat-label">Symptoms</p>
            </div>
          </div>
        )}

        {/* ================= SEARCH / FILTER ================= */}
        {!loading && journals.length > 0 && (
          <>
            <div className="journal-tools">
              <div className="journal-search">
                {Icons.search}
                <input
                  type="text"
                  placeholder="Search your journal entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="journal-clear" onClick={() => setSearchQuery("")} aria-label="Clear">
                    {Icons.close}
                  </button>
                )}
              </div>
              <div className="journal-filter">
                {Icons.filter}
                <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="journal-pills">
              {categories.map((cat) => {
                const count = cat === "All" ? journals.length : categoryCounts[cat] || 0;
                if (cat !== "All" && count === 0) return null;
                const c = getCategoryColor(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`journal-pill ${activeFilter === cat ? "active" : ""}`}
                    style={
                      activeFilter === cat
                        ? { background: c.bg, borderColor: c.border, color: c.text }
                        : {}
                    }
                  >
                    <span className="journal-pill-icon" style={{ color: activeFilter === cat ? c.icon : "#94a3b8" }}>
                      {getCategoryIcon(cat)}
                    </span>
                    {cat}
                    <span className="journal-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================= WEEKLY OVERVIEW ================= */}
        {!loading && journals.length > 0 && (
          <section className="journal-overview-section">
            <div className="journal-overview-header">
              <div>
                <h2 className="journal-overview-title">
                  {Icons.calendar}
                  Weekly Overview
                </h2>
                <p className="journal-overview-subtitle">Your journal activity over the last 7 days</p>
              </div>
              <button className="journal-overview-toggle" onClick={() => setShowWeeklyOverview(!showWeeklyOverview)}>
                {showWeeklyOverview ? "Hide" : "Show"}
              </button>
            </div>

            {showWeeklyOverview && (
              <div className="journal-overview-content">
                <div className="journal-weekly-stats">
                  <div className="journal-weekly-card">
                    <div className="journal-weekly-icon blue">{Icons.journal}</div>
                    <div>
                      <p className="journal-weekly-value">{weeklyEntryCount}</p>
                      <p className="journal-weekly-label">Entries</p>
                    </div>
                  </div>
                  <div className="journal-weekly-card">
                    <div className="journal-weekly-icon green">{Icons.calendar}</div>
                    <div>
                      <p className="journal-weekly-value">{weeklyActiveDays}</p>
                      <p className="journal-weekly-label">Active Days</p>
                    </div>
                  </div>
                  <div className="journal-weekly-card">
                    <div className="journal-weekly-icon violet">{Icons.sparkle}</div>
                    <div>
                      <p className="journal-weekly-value">{weeklyTopCategory}</p>
                      <p className="journal-weekly-label">Top Category</p>
                    </div>
                  </div>
                </div>

                <div className="journal-week-chart">
                  <div className="journal-week-chart-header">
                    <div>
                      <h3>7-Day Activity</h3>
                      <p>Number of journal entries per day</p>
                    </div>
                    <span>{weeklyEntryCount} total</span>
                  </div>
                  <div className="journal-week-bars">
                    {weeklyData.map((day) => (
                      <div key={day.date.toISOString()} className="journal-week-day">
                        <div className="journal-bar-area">
                          <div
                            className="journal-bar"
                            style={{
                              height: `${Math.max((day.count / maxWeeklyCount) * 100, day.count > 0 ? 12 : 4)}%`,
                            }}
                            title={`${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                          >
                            {day.count > 0 && <span>{day.count}</span>}
                          </div>
                        </div>
                        <p className="journal-week-day-label">{day.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= AI JOURNAL SUMMARY ================= */}
        {!loading && journals.length > 0 && (
          <section className="journal-ai-section">
            <div className="journal-ai-header">
              <div className="journal-ai-header-left">
                <div className="journal-ai-icon">{Icons.sparkle}</div>
                <div>
                  <h2 className="journal-ai-title">AI Journal Summary</h2>
                  <p className="journal-ai-subtitle">
                    Let MediAI summarize patterns and themes from your journal entries.
                  </p>
                </div>
              </div>
              <div className="journal-ai-badge">
                <span className="journal-ai-badge-dot" />
                MediAI
              </div>
            </div>

            <div className="journal-ai-controls">
              <div className="journal-ai-periods">
                <button
                  type="button"
                  className={`journal-ai-period-btn ${aiSummaryPeriod === 7 ? "active" : ""}`}
                  onClick={() => {
                    setAiSummaryPeriod(7);
                    setAiSummary("");
                    setAiSummaryError("");
                  }}
                  disabled={aiLoading}
                >
                  <span>7</span>
                  Last 7 Days
                </button>
                <button
                  type="button"
                  className={`journal-ai-period-btn ${aiSummaryPeriod === 30 ? "active" : ""}`}
                  onClick={() => {
                    setAiSummaryPeriod(30);
                    setAiSummary("");
                    setAiSummaryError("");
                  }}
                  disabled={aiLoading}
                >
                  <span>30</span>
                  Last 30 Days
                </button>
              </div>
              <button
                type="button"
                className="journal-ai-generate-btn"
                onClick={() => generateAISummary(aiSummaryPeriod || 7)}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <span className="journal-ai-mini-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    {Icons.sparkle}
                    Generate Summary
                  </>
                )}
              </button>
            </div>

            {!aiSummary && !aiLoading && !aiSummaryError && (
              <div className="journal-ai-hint">
                <div className="journal-ai-hint-icon">{Icons.journal}</div>
                <div>
                  <p className="journal-ai-hint-title">Understand your journal patterns</p>
                  <p className="journal-ai-hint-text">
                    Select a time period and let MediAI summarize the information you recorded in your health journal.
                  </p>
                </div>
              </div>
            )}

            {aiLoading && (
              <div className="journal-ai-loading">
                <div className="journal-ai-loading-spinner">
                  <div className="journal-ai-loading-ring" />
                  <div className="journal-ai-loading-core">{Icons.sparkle}</div>
                </div>
                <div>
                  <p className="journal-ai-loading-title">Analyzing your journal...</p>
                  <p className="journal-ai-loading-text">
                    MediAI is reviewing your recorded entries and preparing a summary.
                  </p>
                </div>
              </div>
            )}

            {aiSummaryError && !aiLoading && (
              <div className="journal-ai-error">
                <div className="journal-ai-error-icon">!</div>
                <div className="journal-ai-error-content">
                  <p className="journal-ai-error-title">Summary could not be generated</p>
                  <p className="journal-ai-error-text">{aiSummaryError}</p>
                  <button
                    type="button"
                    className="journal-ai-retry-btn"
                    onClick={() => generateAISummary(aiSummaryPeriod || 7)}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {aiSummary && !aiLoading && !aiSummaryError && (
              <div className="journal-ai-result">
                <div className="journal-ai-result-header">
                  <div>
                    <div className="journal-ai-result-title-row">
                      <div className="journal-ai-result-icon">{Icons.sparkle}</div>
                      <div>
                        <h3>Journal Overview</h3>
                        <p>Last {aiSummaryPeriod} days</p>
                      </div>
                    </div>
                  </div>
                  <div className="journal-ai-entry-count">
                    {aiSummaryEntryCount} {aiSummaryEntryCount === 1 ? "entry" : "entries"}
                  </div>
                </div>
                <div className="journal-ai-summary-content">
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                </div>
                <div className="journal-ai-safety">
                  <span className="journal-ai-safety-icon">{Icons.shield}</span>
                  <p>
                    This summary is based only on information you recorded in your journal. It is intended for
                    personal reflection and does not provide a medical diagnosis, treatment recommendation, or
                    medical advice.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= SECTION HEADER ================= */}
        {!loading && journals.length > 0 && (
          <div className="journal-section-head">
            <h2 className="journal-section-title">
              {Icons.journal}
              Journal History
            </h2>
            <span className="journal-count">
              {filteredJournals.length} {filteredJournals.length === 1 ? "Entry" : "Entries"}
            </span>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="journal-loading">
            <div className="journal-spinner">
              <div className="journal-spinner-ring" />
              <div className="journal-spinner-core" />
            </div>
            <p className="journal-loading-text">Loading your journal...</p>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && journals.length === 0 && (
          <div className="journal-empty">
            <div className="journal-empty-icon">{Icons.journal}</div>
            <h2 className="journal-empty-title">Your journal awaits</h2>
            <p className="journal-empty-text">
              Start recording your daily health experiences, symptoms, moods, and progress. Your wellness journey
              begins here.
            </p>
            <button className="journal-empty-btn" onClick={() => setShowForm(true)}>
              {Icons.plus}
              Create Your First Entry
            </button>
          </div>
        )}

        {/* ================= NO RESULTS ================= */}
        {!loading && journals.length > 0 && filteredJournals.length === 0 && (
          <div className="journal-empty">
            <div className="journal-empty-icon">{Icons.search}</div>
            <h3 className="journal-empty-title">No entries found</h3>
            <p className="journal-empty-text">Try adjusting your search or filter criteria.</p>
            <button
              className="journal-empty-btn"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ================= JOURNAL LIST ================= */}
        {!loading && filteredJournals.length > 0 && (
          <div className="journal-list">
            {filteredJournals.map((journal) => {
              const c = getCategoryColor(journal.category);
              return (
                <div key={journal._id} className="journal-card">
                  <div className="journal-card-accent" style={{ background: c.text }} />
                  <div className="journal-card-left">
                    <div className="journal-card-icon" style={{ background: c.bg, color: c.icon }}>
                      {getCategoryIcon(journal.category)}
                    </div>
                    <div className="journal-card-content">
                      <div className="journal-card-meta">
                        <div className="journal-card-date">
                          {Icons.calendar}
                          {new Date(journal.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span
                          className="journal-card-category"
                          style={{ background: c.bg, borderColor: c.border, color: c.text }}
                        >
                          {journal.category}
                        </span>
                      </div>
                      <h3 className="journal-card-title">{journal.title}</h3>
                      <p className="journal-card-note">{journal.note}</p>
                    </div>
                  </div>
                  <div className="journal-card-right">
                    <div className="journal-actions">
                      <button className="journal-view-btn" onClick={() => setSelectedJournal(journal)}>
                        {Icons.view}
                        View
                      </button>
                      <button className="journal-edit-btn" onClick={() => handleEdit(journal)}>
                        {Icons.edit}
                        Edit
                      </button>
                      <button className="journal-delete-btn" onClick={() => handleDelete(journal._id)}>
                        {Icons.trash}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= SAFETY NOTE ================= */}
        <div className="journal-safety">
          <div className="journal-safety-icon">{Icons.shield}</div>
          <div>
            <p className="journal-safety-title">Privacy & Safety Notice</p>
            <p className="journal-safety-text">
              Your journal is for personal record-keeping only. Information recorded here is not used to provide a
              medical diagnosis or medical advice. Always consult with a qualified healthcare professional for
              medical concerns.
            </p>
          </div>
        </div>

        {/* ================= MODAL ================= */}
        {showForm && (
          <div className="journal-modal-overlay">
            <div className="journal-modal">
              <div className="journal-modal-top" />
              <div className="journal-modal-header">
                <div className="journal-modal-header-left">
                  <div className="journal-modal-icon">{editingJournal ? Icons.edit : Icons.plus}</div>
                  <div>
                    <h2 className="journal-modal-title">
                      {editingJournal ? "Edit Journal Entry" : "New Journal Entry"}
                    </h2>
                    <p className="journal-modal-subtitle">Record your health experiences</p>
                  </div>
                </div>
                <button className="journal-close" onClick={handleCancel} aria-label="Close">
                  {Icons.close}
                </button>
              </div>

              <form className="journal-form" onSubmit={handleSubmit}>
                <div className="journal-field">
                  <label className="journal-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="journal-input"
                    placeholder="e.g. Feeling tired today"
                    required
                  />
                </div>

                <div className="journal-field">
                  <label className="journal-label">Category</label>
                  <div className="journal-category-grid">
                    {[
                      "General",
                      "Symptoms",
                      "Sleep",
                      "Nutrition",
                      "Exercise",
                      "Mood",
                      "Medication",
                      "Other",
                    ].map((cat) => {
                      const c = getCategoryColor(cat);
                      const isActive = formData.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`journal-category-btn ${isActive ? "active" : ""}`}
                          style={isActive ? { background: c.bg, borderColor: c.text, color: c.text } : {}}
                        >
                          <span className="journal-category-icon" style={{ color: isActive ? c.icon : "#94a3b8" }}>
                            {getCategoryIcon(cat)}
                          </span>
                          <span className="journal-category-name">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="journal-field">
                  <label className="journal-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="journal-input"
                    required
                  />
                </div>

                <div className="journal-field">
                  <label className="journal-label">Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="journal-textarea"
                    placeholder="Write about your day, sleep, food, exercise, symptoms, or other health-related information..."
                    rows="5"
                    required
                  />
                </div>

                <div className="journal-modal-actions">
                  <button type="button" className="journal-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="journal-save">
                    {editingJournal ? Icons.check : Icons.plus}
                    {editingJournal ? "Save Changes" : "Save Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= VIEW JOURNAL MODAL ================= */}
        {selectedJournal && (
          <div className="journal-modal-overlay" onClick={() => setSelectedJournal(null)}>
            <div className="journal-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="journal-modal-top" />
              <div className="journal-view-header">
                <div className="journal-modal-header-left">
                  <div
                    className="journal-view-category-icon"
                    style={{
                      background: getCategoryColor(selectedJournal.category).bg,
                      color: getCategoryColor(selectedJournal.category).icon,
                    }}
                  >
                    {getCategoryIcon(selectedJournal.category)}
                  </div>
                  <div>
                    <h2 className="journal-view-title">Journal Entry</h2>
                    <p className="journal-modal-subtitle">View your recorded health information</p>
                  </div>
                </div>
                <button className="journal-close" onClick={() => setSelectedJournal(null)} aria-label="Close">
                  {Icons.close}
                </button>
              </div>

              <div className="journal-view-content">
                <div className="journal-view-section">
                  <p className="journal-view-label">Title</p>
                  <h3 className="journal-view-entry-title">{selectedJournal.title}</h3>
                </div>

                <div className="journal-view-info-grid">
                  <div className="journal-view-info">
                    <span className="journal-view-info-icon">{Icons.calendar}</span>
                    <div>
                      <p className="journal-view-label">Date</p>
                      <p className="journal-view-value">
                        {new Date(selectedJournal.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="journal-view-info">
                    <span
                      className="journal-view-info-icon"
                      style={{ color: getCategoryColor(selectedJournal.category).icon }}
                    >
                      {getCategoryIcon(selectedJournal.category)}
                    </span>
                    <div>
                      <p className="journal-view-label">Category</p>
                      <p
                        className="journal-view-value"
                        style={{ color: getCategoryColor(selectedJournal.category).text }}
                      >
                        {selectedJournal.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="journal-view-note-box">
                  <p className="journal-view-label">Journal Note</p>
                  <p className="journal-view-note">{selectedJournal.note}</p>
                </div>

                <div className="journal-view-safety">
                  <span>{Icons.shield}</span>
                  <p>
                    This information is based on your personal journal entry and is not a medical diagnosis or medical
                    advice.
                  </p>
                </div>
              </div>

              <div className="journal-view-actions">
                <button className="journal-view-close-btn" onClick={() => setSelectedJournal(null)}>
                  Close
                </button>
                <button
                  className="journal-view-edit-btn"
                  onClick={() => {
                    setSelectedJournal(null);
                    handleEdit(selectedJournal);
                  }}
                >
                  {Icons.edit}
                  Edit Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===============================
// STYLES
// ===============================
const journalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .journal-root {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    padding: 40px 16px 80px;
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #eef4ff 0%, #f7faff 40%, #eaf1ff 100%);
    color: #0f172a;
  }

  /* ================= BACKGROUND ================= */
  .journal-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .journal-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.55;
  }
  .journal-blob.b1 { width: 380px; height: 380px; background: #bfdbfe; top: 5%; left: 10%; }
  .journal-blob.b2 { width: 320px; height: 320px; background: #c7d2fe; bottom: 10%; right: 10%; }
  .journal-blob.b3 { width: 260px; height: 260px; background: #a5f3fc; top: 40%; right: 30%; }

  .journal-hex {
    position: absolute;
    background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(99,102,241,0.05));
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  .journal-hex.h1 { top: -60px; left: -80px; width: 220px; height: 220px; }
  .journal-hex.h2 { top: 20%; right: -100px; width: 300px; height: 300px; }
  .journal-hex.h3 { bottom: -80px; left: 15%; width: 260px; height: 260px; }

  /* ================= WRAPPER ================= */
  .journal-wrapper {
    position: relative;
    z-index: 1;
    max-width: 960px;
    margin: 0 auto;
  }

  /* ================= HEADER ================= */
  .journal-header {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 30px;
    animation: journal-fadeUp 0.6s ease both;
  }
  @media (min-width: 640px) {
    .journal-header {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .journal-header-left { display: flex; align-items: center; gap: 14px; }

  .journal-logo {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    box-shadow: 0 10px 24px rgba(59,130,246,0.35);
    transition: transform 0.3s ease;
  }
  .journal-logo:hover { transform: scale(1.05) rotate(3deg); }
  .journal-logo svg { width: 26px; height: 26px; }

  .journal-title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .journal-subtitle { margin: 5px 0 0; color: #64748b; font-size: 14px; }

  /* ================= PRIMARY BUTTON ================= */
  .journal-primary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 14px 22px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(59,130,246,0.35);
    transition: 0.3s ease;
  }
  .journal-primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px rgba(99,102,241,0.45);
  }
  .journal-primary-btn svg { width: 17px; height: 17px; }

  /* ================= STATS ================= */
  .journal-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
    animation: journal-fadeUp 0.6s ease both;
  }
  @media (min-width: 640px) {
    .journal-stats { grid-template-columns: repeat(4, 1fr); }
  }

  .journal-stat-card {
    padding: 16px;
    border-radius: 16px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(59,130,246,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .journal-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(59,130,246,0.14);
  }

  .journal-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: white;
    margin-bottom: 10px;
  }
  .journal-stat-icon svg { width: 18px; height: 18px; }
  .journal-stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 6px 14px rgba(59,130,246,0.28); }
  .journal-stat-icon.green { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 6px 14px rgba(16,185,129,0.28); }
  .journal-stat-icon.violet { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 6px 14px rgba(139,92,246,0.28); }
  .journal-stat-icon.orange { background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 6px 14px rgba(249,115,22,0.28); }

  .journal-stat-value { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  .journal-stat-label { margin: 3px 0 0; font-size: 11.5px; color: #64748b; font-weight: 600; }

  /* ================= TOOLS ================= */
  .journal-tools {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
    animation: journal-fadeUp 0.6s ease both;
  }
  @media (min-width: 640px) {
    .journal-tools { grid-template-columns: 1fr 210px; }
  }

  .journal-search, .journal-filter {
    min-height: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 15px;
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 14px;
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(59,130,246,0.08);
    position: relative;
  }
  .journal-search svg, .journal-filter svg {
    width: 18px;
    height: 18px;
    color: #3b82f6;
    flex-shrink: 0;
  }
  .journal-search input, .journal-filter select {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #0f172a;
    font-family: inherit;
    font-size: 13.5px;
  }
  .journal-search input::placeholder { color: #94a3b8; }
  .journal-filter select { cursor: pointer; }

  .journal-clear {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f1f5f9;
    color: #94a3b8;
    cursor: pointer;
    transition: 0.25s ease;
    flex-shrink: 0;
  }
  .journal-clear:hover { background: #fee2e2; color: #dc2626; }
  .journal-clear svg { width: 12px; height: 12px; color: inherit; }

  /* ================= PILLS ================= */
  .journal-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
    animation: journal-fadeUp 0.6s ease both;
  }

  .journal-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border: 1px solid rgba(148,163,184,0.25);
    border-radius: 10px;
    background: rgba(255,255,255,0.78);
    color: #475569;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
    backdrop-filter: blur(12px);
  }
  .journal-pill:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,0.12); }
  .journal-pill.active { box-shadow: 0 8px 20px rgba(59,130,246,0.18); }

  .journal-pill-icon {
    width: 14px;
    height: 14px;
    display: grid;
    place-items: center;
  }
  .journal-pill-icon svg { width: 14px; height: 14px; }

  .journal-pill-count {
    padding: 1px 6px;
    border-radius: 999px;
    background: rgba(59,130,246,0.12);
    color: #1e40af;
    font-size: 10px;
    font-weight: 800;
  }
  .journal-pill.active .journal-pill-count {
    background: rgba(255,255,255,0.6);
    color: inherit;
  }

  /* ================= SECTION HEAD ================= */
  .journal-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .journal-section-title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 800;
  }
  .journal-section-title svg { width: 20px; height: 20px; color: #3b82f6; }

  .journal-count {
    padding: 6px 13px;
    border-radius: 999px;
    color: #1e40af;
    background: rgba(59,130,246,0.10);
    border: 1px solid rgba(59,130,246,0.20);
    font-size: 12px;
    font-weight: 700;
  }

  /* ================= LOADING ================= */
  .journal-loading {
    padding: 60px 25px;
    text-align: center;
    border-radius: 22px;
    background: rgba(255,255,255,0.60);
    backdrop-filter: blur(14px);
    box-shadow: 0 15px 40px rgba(59,130,246,0.08);
    animation: journal-fadeUp 0.7s ease both;
  }

  .journal-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto 18px;
  }
  .journal-spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid #dbeafe;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: journal-spin 1s linear infinite;
  }
  .journal-spinner-core {
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    opacity: 0.5;
    animation: journal-pulse 1.5s ease-in-out infinite;
  }
  .journal-loading-text { margin: 0; font-size: 14px; font-weight: 600; color: #64748b; }

  /* ================= EMPTY ================= */
  .journal-empty {
    padding: 55px 25px;
    text-align: center;
    border-radius: 22px;
    border: 1px dashed rgba(100,116,139,0.25);
    background: rgba(255,255,255,0.60);
    backdrop-filter: blur(14px);
    box-shadow: 0 15px 40px rgba(59,130,246,0.08);
    animation: journal-fadeUp 0.7s ease both;
  }

  .journal-empty-icon {
    width: 82px;
    height: 82px;
    margin: 0 auto 18px;
    border-radius: 24px;
    display: grid;
    place-items: center;
    color: #2563eb;
    background: linear-gradient(135deg, #e0edff, #eef4ff);
    box-shadow:
      inset 0 0 0 1px rgba(59,130,246,0.14),
      0 12px 28px rgba(59,130,246,0.18);
    transition: transform 0.4s ease;
  }
  .journal-empty:hover .journal-empty-icon { transform: scale(1.08) rotate(3deg); }
  .journal-empty-icon svg { width: 42px; height: 42px; }

  .journal-empty-title { margin: 0; font-size: 19px; font-weight: 800; }

  .journal-empty-text {
    max-width: 430px;
    margin: 7px auto 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
  }

  .journal-empty-btn {
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 18px;
    border: 1px solid rgba(59,130,246,0.25);
    border-radius: 12px;
    background: white;
    color: #2563eb;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
  }
  .journal-empty-btn:hover {
    background: #eff6ff;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(59,130,246,0.18);
  }
  .journal-empty-btn svg { width: 14px; height: 14px; }

  /* ================= NO USER ================= */
  .journal-no-user {
    max-width: 480px;
    margin: 80px auto 0;
    padding: 50px 30px;
    text-align: center;
    border-radius: 22px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.9);
    backdrop-filter: blur(14px);
    box-shadow: 0 20px 50px rgba(59,130,246,0.12);
    animation: journal-fadeUp 0.6s ease both;
  }

  /* ================= WEEKLY OVERVIEW ================= */

.journal-overview-section {
  margin-bottom: 30px;
  padding: 22px;
  border-radius: 20px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(255,255,255,0.9);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 35px rgba(59,130,246,0.09);
  animation: journal-fadeUp 0.6s ease both;
}

.journal-overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.journal-overview-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.journal-overview-title svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.journal-overview-subtitle {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 12.5px;
}

.journal-overview-toggle {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(59,130,246,0.20);
  background: #eff6ff;
  color: #2563eb;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
}

.journal-overview-toggle:hover {
  background: #dbeafe;
}

.journal-weekly-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.journal-weekly-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 15px;
  background: #f8fafc;
  border: 1px solid rgba(148,163,184,0.14);
}

.journal-weekly-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: white;
}

.journal-weekly-icon svg {
  width: 19px;
  height: 19px;
}

.journal-weekly-icon.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.journal-weekly-icon.green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.journal-weekly-icon.violet {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.journal-weekly-value {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.journal-weekly-label {
  margin: 2px 0 0;
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
}

.journal-week-chart {
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    #f8fbff 0%,
    #f1f5ff 100%
  );
  border: 1px solid rgba(59,130,246,0.12);
}

.journal-week-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.journal-week-chart-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.journal-week-chart-header p {
  margin: 3px 0 0;
  font-size: 11px;
  color: #64748b;
}

.journal-week-chart-header > span {
  padding: 5px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
}

.journal-week-bars {
  height: 190px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 10px;
}

.journal-week-day {
  flex: 1;
  height: 100%;
  max-width: 70px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.journal-bar-area {
  width: 100%;
  height: 145px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.journal-bar {
  width: 28px;
  min-height: 4px;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(
    180deg,
    #6366f1,
    #3b82f6
  );
  box-shadow: 0 6px 14px rgba(59,130,246,0.22);
  position: relative;
  transition: height 0.4s ease, transform 0.25s ease;
}

.journal-bar:hover {
  transform: translateY(-3px);
}

.journal-bar span {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 800;
  color: #2563eb;
}

.journal-week-day-label {
  margin: 9px 0 0;
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
}

  /* ================= LIST ================= */
  .journal-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 30px;
  }

  .journal-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 18px 18px 22px;
    border-radius: 18px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(59,130,246,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    animation: journal-fadeUp 0.5s ease both;
  }
  .journal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(59,130,246,0.14);
  }

  .journal-card-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 18px 0 0 18px;
    opacity: 0.7;
  }

  .journal-card-left {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    min-width: 0;
    flex: 1;
  }

  .journal-card-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 14px;
    display: grid;
    place-items: center;
    transition: transform 0.3s ease;
  }
  .journal-card:hover .journal-card-icon { transform: scale(1.08) rotate(3deg); }
  .journal-card-icon svg { width: 23px; height: 23px; }

  .journal-card-content { min-width: 0; flex: 1; }

  .journal-card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .journal-card-date {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 700;
    color: #64748b;
  }
  .journal-card-date svg { width: 13px; height: 13px; color: #3b82f6; }

  .journal-card-category {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .journal-card-title {
    margin: 0;
    font-size: 15.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.4;
    word-break: break-word;
  }

  .journal-card-note {
    margin: 6px 0 0;
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .journal-card-right {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .journal-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journal-view-btn, .journal-edit-btn, .journal-delete-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 14px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
    white-space: nowrap;
  }

  .journal-view-btn {
    border: 1px solid rgba(14,165,233,0.20);
    background: #f0f9ff;
    color: #0284c7;
  }
  .journal-view-btn:hover {
    background: #e0f2fe;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(14,165,233,0.18);
  }

  .journal-edit-btn {
    border: 1px solid rgba(59,130,246,0.20);
    background: #eff6ff;
    color: #2563eb;
  }
  .journal-edit-btn:hover {
    background: #dbeafe;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59,130,246,0.18);
  }

  .journal-delete-btn {
    border: 1px solid rgba(239,68,68,0.20);
    background: #fef2f2;
    color: #dc2626;
  }
  .journal-delete-btn:hover {
    background: #fee2e2;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239,68,68,0.18);
  }

  .journal-view-btn svg, .journal-edit-btn svg, .journal-delete-btn svg { width: 14px; height: 14px; }

  /* ================= SAFETY ================= */
  .journal-safety {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    border-radius: 18px;
    background: linear-gradient(135deg, #eff6ff 0%, #eef4ff 100%);
    border: 1px solid rgba(59,130,246,0.16);
    box-shadow: 0 10px 30px rgba(59,130,246,0.08);
    overflow: hidden;
    animation: journal-fadeUp 0.7s ease both;
  }
  .journal-safety::before {
    content: "";
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(59,130,246,0.10);
    filter: blur(30px);
  }

  .journal-safety-icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 13px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    box-shadow: 0 8px 20px rgba(59,130,246,0.28);
  }
  .journal-safety-icon svg { width: 20px; height: 20px; }

  .journal-safety-title { margin: 0; font-size: 13.5px; font-weight: 800; color: #1e3a8a; }

  .journal-safety-text {
    margin: 4px 0 0;
    font-size: 12.5px;
    color: #1e40af;
    line-height: 1.7;
  }

  /* ================= MODAL ================= */
  .journal-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15,23,42,0.45);
    backdrop-filter: blur(6px);
    animation: journal-fadeIn 0.25s ease both;
  }

  .journal-modal {
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 24px;
    background: rgba(255,255,255,0.98);
    box-shadow: 0 30px 80px -20px rgba(59,130,246,0.45);
    animation: journal-fadeUp 0.35s ease both;
  }

  .journal-modal-top {
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #6366f1, #06b6d4);
  }

  .journal-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 8px;
  }

  .journal-modal-header-left {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .journal-modal-icon {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    box-shadow: 0 8px 20px rgba(59,130,246,0.28);
  }
  .journal-modal-icon svg { width: 21px; height: 21px; }

  .journal-modal-title { margin: 0; font-size: 17px; font-weight: 800; }
  .journal-modal-subtitle { margin: 3px 0 0; font-size: 12.5px; color: #64748b; }

  .journal-close {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: 0.25s ease;
  }
  .journal-close:hover { background: #eff6ff; color: #2563eb; transform: rotate(90deg); }
  .journal-close svg { width: 17px; height: 17px; }

  .journal-form {
    padding: 18px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 17px;
  }

  .journal-field { display: flex; flex-direction: column; gap: 8px; }

  .journal-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
  }

  .journal-input, .journal-textarea {
    width: 100%;
    padding: 13px 12px;
    border: 1px solid rgba(148,163,184,0.30);
    border-radius: 12px;
    outline: none;
    background: #f8fafc;
    color: #0f172a;
    font-family: inherit;
    font-size: 14px;
    transition: 0.25s ease;
  }
  .journal-input:focus, .journal-textarea:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
  }
  .journal-textarea { resize: vertical; min-height: 110px; }

  /* ================= VIEW JOURNAL MODAL ================= */

.journal-view-modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  background: rgba(255,255,255,0.98);
  box-shadow: 0 30px 80px -20px rgba(59,130,246,0.45);
  animation: journal-fadeUp 0.35s ease both;
}

.journal-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 16px;
  border-bottom: 1px solid rgba(148,163,184,0.15);
}

.journal-view-category-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: grid;
  place-items: center;
}

.journal-view-category-icon svg {
  width: 21px;
  height: 21px;
}

.journal-view-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.journal-view-content {
  padding: 22px 24px;
}

.journal-view-section {
  margin-bottom: 20px;
}

.journal-view-label {
  margin: 0 0 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.journal-view-entry-title {
  margin: 0;
  font-size: 21px;
  line-height: 1.4;
  font-weight: 800;
  color: #0f172a;
  word-break: break-word;
}

.journal-view-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.journal-view-info {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid rgba(148,163,184,0.15);
}

.journal-view-info-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #eff6ff;
  color: #2563eb;
}

.journal-view-info-icon svg {
  width: 18px;
  height: 18px;
}

.journal-view-value {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.journal-view-note-box {
  padding: 18px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgba(148,163,184,0.16);
}

.journal-view-note {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #475569;
  white-space: pre-wrap;
  word-break: break-word;
}

.journal-view-safety {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  padding: 13px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid rgba(59,130,246,0.14);
}

.journal-view-safety > span {
  flex-shrink: 0;
  color: #2563eb;
}

.journal-view-safety svg {
  width: 17px;
  height: 17px;
}

.journal-view-safety p {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: #1e40af;
}

.journal-view-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid rgba(148,163,184,0.15);
}

.journal-view-close-btn,
.journal-view-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 17px;
  border-radius: 11px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.journal-view-close-btn {
  border: 1px solid rgba(148,163,184,0.30);
  background: white;
  color: #475569;
}

.journal-view-close-btn:hover {
  background: #f8fafc;
}

.journal-view-edit-btn {
  border: 1px solid rgba(59,130,246,0.20);
  background: #eff6ff;
  color: #2563eb;
}

.journal-view-edit-btn:hover {
  background: #dbeafe;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59,130,246,0.18);
}

.journal-view-edit-btn svg {
  width: 14px;
  height: 14px;
}

  /* ================= CATEGORY GRID ================= */
  .journal-category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .journal-category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 4px;
    border: 1.5px solid rgba(148,163,184,0.25);
    border-radius: 12px;
    background: #f8fafc;
    color: #64748b;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
  }
  .journal-category-btn:hover {
    border-color: rgba(59,130,246,0.35);
    background: #eff6ff;
    transform: translateY(-1px);
  }
  .journal-category-btn.active {
    background: white;
    box-shadow: 0 6px 16px rgba(59,130,246,0.15);
  }

  .journal-category-icon {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
  }
  .journal-category-icon svg { width: 18px; height: 18px; }

  .journal-category-name { font-size: 9.5px; line-height: 1.1; text-align: center; }

  /* ================= MODAL ACTIONS ================= */
  .journal-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 5px;
  }

  .journal-cancel, .journal-save {
    padding: 11px 18px;
    border-radius: 11px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .journal-cancel {
    border: 1px solid rgba(148,163,184,0.35);
    background: white;
    color: #475569;
  }
  .journal-cancel:hover { background: #f8fafc; }

  .journal-save {
    border: none;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    box-shadow: 0 8px 20px rgba(59,130,246,0.28);
  }
  .journal-save:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 25px rgba(59,130,246,0.35);
  }
  .journal-save svg { width: 14px; height: 14px; }

  /* ================= ANIMATIONS ================= */
  @keyframes journal-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes journal-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes journal-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes journal-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }


  /* ================= AI JOURNAL SUMMARY ================= */

.journal-ai-section {
  margin-bottom: 30px;
  padding: 22px;
  border-radius: 20px;
  background: rgba(255,255,255,0.80);
  border: 1px solid rgba(255,255,255,0.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 35px rgba(59,130,246,0.09);
  animation: journal-fadeUp 0.6s ease both;
}

.journal-ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.journal-ai-header-left {
  display: flex;
  align-items: center;
  gap: 13px;
}

.journal-ai-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 8px 20px rgba(99,102,241,0.28);
}

.journal-ai-icon svg {
  width: 21px;
  height: 21px;
}

.journal-ai-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.journal-ai-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
}

.journal-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f5f3ff;
  border: 1px solid rgba(139,92,246,0.18);
  color: #7c3aed;
  font-size: 10.5px;
  font-weight: 800;
  white-space: nowrap;
}

.journal-ai-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139,92,246,0.10);
}

/* ================= AI CONTROLS ================= */

.journal-ai-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px;
  margin-bottom: 15px;
  border-radius: 15px;
  background: #f8fafc;
  border: 1px solid rgba(148,163,184,0.14);
}

.journal-ai-periods {
  display: flex;
  gap: 8px;
}

.journal-ai-period-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid rgba(148,163,184,0.25);
  border-radius: 10px;
  background: white;
  color: #64748b;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.journal-ai-period-btn:hover:not(:disabled) {
  border-color: rgba(99,102,241,0.30);
  background: #f5f3ff;
  color: #7c3aed;
}

.journal-ai-period-btn.active {
  border-color: rgba(99,102,241,0.28);
  background: #f5f3ff;
  color: #7c3aed;
  box-shadow: 0 5px 14px rgba(99,102,241,0.12);
}

.journal-ai-period-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.journal-ai-period-btn span {
  min-width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #eef2ff;
  color: #6366f1;
  font-size: 9px;
  font-weight: 800;
}

.journal-ai-period-btn.active span {
  background: #6366f1;
  color: white;
}

.journal-ai-generate-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(99,102,241,0.25);
  transition: 0.25s ease;
}

.journal-ai-generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 11px 24px rgba(99,102,241,0.34);
}

.journal-ai-generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.journal-ai-generate-btn svg {
  width: 15px;
  height: 15px;
}

/* ================= AI HINT ================= */

.journal-ai-hint {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f5f3ff, #eff6ff);
  border: 1px solid rgba(99,102,241,0.12);
}

.journal-ai-hint-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: white;
  color: #6366f1;
  box-shadow: 0 5px 14px rgba(99,102,241,0.10);
}

.journal-ai-hint-icon svg {
  width: 18px;
  height: 18px;
}

.journal-ai-hint-title {
  margin: 0;
  font-size: 12.5px;
  font-weight: 800;
  color: #3730a3;
}

.journal-ai-hint-text {
  margin: 4px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: #64748b;
}

/* ================= AI LOADING ================= */

.journal-ai-loading {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f5f3ff, #eff6ff);
  border: 1px solid rgba(99,102,241,0.13);
}

.journal-ai-loading-spinner {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.journal-ai-loading-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #ddd6fe;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: journal-spin 0.9s linear infinite;
}

.journal-ai-loading-core {
  position: absolute;
  inset: 11px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  animation: journal-pulse 1.5s ease-in-out infinite;
}

.journal-ai-loading-core svg {
  width: 14px;
  height: 14px;
}

.journal-ai-loading-title {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: #3730a3;
}

.journal-ai-loading-text {
  margin: 4px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: #64748b;
}

/* ================= AI ERROR ================= */

.journal-ai-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 15px;
  background: #fff7f7;
  border: 1px solid rgba(239,68,68,0.16);
}

.journal-ai-error-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 15px;
  font-weight: 800;
}

.journal-ai-error-title {
  margin: 0;
  font-size: 12.5px;
  font-weight: 800;
  color: #991b1b;
}

.journal-ai-error-text {
  margin: 4px 0 9px;
  font-size: 11.5px;
  line-height: 1.5;
  color: #7f1d1d;
}

.journal-ai-retry-btn {
  padding: 7px 11px;
  border: 1px solid rgba(239,68,68,0.20);
  border-radius: 8px;
  background: white;
  color: #dc2626;
  font-family: inherit;
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
}

.journal-ai-retry-btn:hover {
  background: #fef2f2;
}

/* ================= AI RESULT ================= */

.journal-ai-result {
  overflow: hidden;
  border-radius: 17px;
  background: white;
  border: 1px solid rgba(99,102,241,0.14);
  box-shadow: 0 10px 28px rgba(99,102,241,0.08);
}

.journal-ai-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px;
  background: linear-gradient(135deg, #f5f3ff, #eff6ff);
  border-bottom: 1px solid rgba(99,102,241,0.10);
}

.journal-ai-result-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.journal-ai-result-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: white;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.journal-ai-result-icon svg {
  width: 17px;
  height: 17px;
}

.journal-ai-result-header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.journal-ai-result-header p {
  margin: 2px 0 0;
  font-size: 10.5px;
  color: #64748b;
}

.journal-ai-entry-count {
  padding: 5px 9px;
  border-radius: 999px;
  background: white;
  border: 1px solid rgba(99,102,241,0.15);
  color: #6366f1;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

/* ================= AI MARKDOWN ================= */

.journal-ai-summary-content {
  padding: 20px;
  color: #334155;
  font-size: 13px;
  line-height: 1.75;
}

.journal-ai-summary-content h1,
.journal-ai-summary-content h2,
.journal-ai-summary-content h3 {
  color: #0f172a;
  line-height: 1.4;
}

.journal-ai-summary-content h1 {
  margin: 0 0 13px;
  font-size: 18px;
}

.journal-ai-summary-content h2 {
  margin: 18px 0 8px;
  font-size: 15px;
}

.journal-ai-summary-content h3 {
  margin: 15px 0 7px;
  font-size: 13.5px;
}

.journal-ai-summary-content p {
  margin: 7px 0;
}

.journal-ai-summary-content ul,
.journal-ai-summary-content ol {
  margin: 8px 0;
  padding-left: 21px;
}

.journal-ai-summary-content li {
  margin: 4px 0;
}

.journal-ai-summary-content strong {
  color: #1e293b;
  font-weight: 800;
}

.journal-ai-summary-content em {
  color: #475569;
}

.journal-ai-summary-content blockquote {
  margin: 12px 0;
  padding: 10px 14px;
  border-left: 3px solid #6366f1;
  background: #f5f3ff;
  color: #475569;
  border-radius: 0 9px 9px 0;
}

/* ================= AI SAFETY ================= */

.journal-ai-safety {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 18px 18px;
  padding: 12px;
  border-radius: 11px;
  background: #eff6ff;
  border: 1px solid rgba(59,130,246,0.13);
}

.journal-ai-safety-icon {
  flex-shrink: 0;
  color: #2563eb;
}

.journal-ai-safety-icon svg {
  width: 17px;
  height: 17px;
}

.journal-ai-safety p {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.6;
  color: #1e40af;
}

/* ================= AI MINI SPINNER ================= */

.journal-ai-mini-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.45);
  border-top-color: white;
  border-radius: 50%;
  animation: journal-spin 0.7s linear infinite;
}

  /* ================= MOBILE ================= */
  @media (max-width: 640px) {
    .journal-root { padding: 24px 14px 60px; }
    .journal-title { font-size: 24px; }
    .journal-logo { width: 46px; height: 46px; }
    .journal-header { margin-bottom: 25px; }
    .journal-primary-btn { width: 100%; }
    .journal-empty { padding: 45px 18px; }
    .journal-modal-header { padding-left: 18px; padding-right: 18px; }
    .journal-form { padding-left: 18px; padding-right: 18px; }

    .journal-card {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }
    .journal-card-right {
      justify-content: flex-end;
      width: 100%;
      padding-top: 12px;
      border-top: 1px solid rgba(59,130,246,0.10);
    }
    .journal-actions { flex: 1; }
    .journal-edit-btn, .journal-delete-btn { flex: 1; justify-content: center; }

    .journal-category-grid { grid-template-columns: repeat(4, 1fr); }

    .journal-view-header {
  padding-left: 18px;
  padding-right: 18px;
}

.journal-view-content {
  padding-left: 18px;
  padding-right: 18px;
}

.journal-view-actions {
  padding-left: 18px;
  padding-right: 18px;
}

.journal-view-info-grid {
  grid-template-columns: 1fr;
}

.journal-view-actions {
  flex-direction: column-reverse;
}

.journal-view-close-btn,
.journal-view-edit-btn {
  width: 100%;
}

.journal-overview-section {
  padding: 17px;
}

.journal-overview-header {
  align-items: flex-start;
}

.journal-weekly-stats {
  grid-template-columns: 1fr;
}

.journal-weekly-card {
  padding: 13px;
}

.journal-week-bars {
  gap: 5px;
}

.journal-bar {
  width: 22px;
}

.journal-week-chart {
  padding: 14px;
}


    /* ================= AI RESPONSIVE ================= */
    .journal-ai-section { padding: 17px; }
    .journal-ai-header { align-items: flex-start; }
    .journal-ai-header-left { min-width: 0; }
    .journal-ai-title { font-size: 17px; }
    .journal-ai-subtitle { font-size: 11.5px; }
    .journal-ai-badge { flex-shrink: 0; }
    .journal-ai-controls { flex-direction: column; align-items: stretch; }
    .journal-ai-periods { width: 100%; flex-wrap: wrap; }
    .journal-ai-period-btn { flex: 1; justify-content: center; }
    .journal-ai-generate-btn { width: 100%; }
    .journal-ai-result-header { align-items: flex-start; }
    .journal-ai-summary-content { padding: 17px; }
    .journal-ai-safety { margin-left: 15px; margin-right: 15px; }

  }
`;

export default HealthJournal;