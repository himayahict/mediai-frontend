import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [question, setQuestion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleAsk = () => {
    if (!question.trim()) return;

    navigate("/ai-assistant", {
      state: {
        question: question.trim(),
      },
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationLoading(true);

        const token = localStorage.getItem("token");

        const response = await API.get("/api/reminders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Dashboard reminders response:", response.data);

        setNotifications(response.data.reminders || []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setNotificationLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ===== SVG Icons (same blue pattern) =====
  const Icons = {
    dashboard: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
    assistant: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="7" width="16" height="12" rx="3" />
        <circle cx="9" cy="13" r="1.2" fill="currentColor" />
        <circle cx="15" cy="13" r="1.2" fill="currentColor" />
        <path d="M12 3v4M8 19v2M16 19v2" />
      </svg>
    ),
    topics: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    appointment: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18M8 15h3M8 18h5" />
      </svg>
    ),
    reminders: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.5 3.5a2 2 0 0 1 3 0l.5 1a6 6 0 0 1 4 5.5V14l1.5 2.5H4.5L6 14v-4a6 6 0 0 1 4-5.5l.5-1z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    ),
    documents: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
    journal: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
        <path d="M18 20a2 2 0 0 0 2-2V8M8 8h6M8 12h6M8 16h4" />
      </svg>
    ),
    profile: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
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
    search: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    logout: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17l-5-5 5-5M5 12h12" />
      </svg>
    ),
    arrow: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    ),
    spark: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    // ===== Notification Type Icons (Blue) =====
    medication: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="8" width="18" height="8" rx="4" />
        <path d="M12 8v8M7.5 12h9" />
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
        <path d="M12 2.5c3.5 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0c0-3 2.5-6 6-10.5z" />
        <path d="M9 14a3 3 0 0 0 3 3" />
      </svg>
    ),
    exercise: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="15" cy="5" r="2" />
        <path d="M12 22v-6l-3-3 3-3 3 3h4M6 12l-3 3" />
      </svg>
    ),
    appointmentIcon: (
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
    defaultBell: (
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
    close: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    check: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  };

  // ===== Get Notification Icon based on type =====
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Medication":
        return Icons.medication;
      case "Water":
        return Icons.water;
      case "Exercise":
        return Icons.exercise;
      case "Appointment":
        return Icons.appointmentIcon;
      default:
        return Icons.defaultBell;
    }
  };

  // ===== Get Notification Color based on type =====
  const getNotificationColor = (type) => {
    switch (type) {
      case "Medication":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-blue-600",
          text: "text-blue-600",
          lightBg: "bg-blue-50",
          border: "border-blue-100",
        };
      case "Water":
        return {
          bg: "bg-gradient-to-br from-sky-400 to-blue-500",
          text: "text-sky-600",
          lightBg: "bg-sky-50",
          border: "border-sky-100",
        };
      case "Exercise":
        return {
          bg: "bg-gradient-to-br from-indigo-500 to-blue-600",
          text: "text-indigo-600",
          lightBg: "bg-indigo-50",
          border: "border-indigo-100",
        };
      case "Appointment":
        return {
          bg: "bg-gradient-to-br from-blue-600 to-indigo-600",
          text: "text-blue-700",
          lightBg: "bg-blue-50",
          border: "border-blue-100",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-500 to-blue-600",
          text: "text-blue-600",
          lightBg: "bg-blue-50",
          border: "border-blue-100",
        };
    }
  };

  // ===== Dashboard Search Data =====
  const searchItems = [
    {
      title: "Health Topics",
      description: "Explore symptoms, conditions and health information",
      keywords:
        "symptom symptoms diabetes blood pressure heart sleep nutrition mental health hydration exercise health topic topics",
      path: "/health-topics",
      icon: Icons.topics,
    },
    {
      title: "Appointment Preparation",
      description: "Prepare questions and information for your appointment",
      keywords: "appointment doctor hospital medical visit consultation",
      path: "/appointments",
      icon: Icons.appointment,
    },
    {
      title: "Documents & Reports",
      description: "View and manage your health-related reports",
      keywords:
        "report reports document documents blood test lab report medical report file",
      path: "/documents",
      icon: Icons.documents,
    },
    {
      title: "Reminders",
      description: "Manage medication and health reminders",
      keywords:
        "reminder reminders medication medicine water exercise appointment",
      path: "/reminders",
      icon: Icons.reminders,
    },
    {
      title: "Health Journal",
      description: "View your personal health notes and entries",
      keywords: "journal journals notes note symptoms sleep mood nutrition",
      path: "/health-journal",
      icon: Icons.journal,
    },
    {
      title: "AI Assistant",
      description: "Ask MediCore AI a general health question",
      keywords:
        "ai assistant mediCore question questions ask health information chatbot",
      path: "/ai-assistant",
      icon: Icons.assistant,
    },
  ];

  // ===== Search Results =====
  const filteredSearchItems = searchItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return false;

    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );
  });

  const handleSearchSelect = (path) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigate(path);
  };

  const navigationItems = [
    { name: "Dashboard", icon: Icons.dashboard, path: "/dashboard" },
    { name: "AI Assistant", icon: Icons.assistant, path: "/ai-assistant" },
    { name: "Health Topics", icon: Icons.topics, path: "/health-topics" },
    {
      name: "Appointment Preparation",
      icon: Icons.appointment,
      path: "/appointments",
    },
    { name: "Reminders", icon: Icons.reminders, path: "/reminders" },
    { name: "Documents", icon: Icons.documents, path: "/documents" },
    { name: "Health Journal", icon: Icons.journal, path: "/health-journal" },
    { name: "Profile", icon: Icons.profile, path: "/profile" },
  ];

  const quickActions = [
    {
      title: "Ask Health Question",
      description: "Get easy-to-understand general health information.",
      icon: Icons.assistant,
      path: "/ai-assistant",
    },
    {
      title: "Health Topics",
      description: "Explore useful health information and topics.",
      icon: Icons.topics,
      path: "/health-topics",
    },
    {
      title: "Prepare for Appointment",
      description: "Organize questions and information for your appointment.",
      icon: Icons.appointment,
      path: "/appointments",
    },
    {
      title: "Reminders",
      description: "Keep track of your medication and health reminders.",
      icon: Icons.reminders,
      path: "/reminders",
    },
    {
      title: "Documents",
      description: "Organize and access your health-related documents.",
      icon: Icons.documents,
      path: "/documents",
    },
    {
      title: "Health Journal",
      description: "Keep your personal health notes organized.",
      icon: Icons.journal,
      path: "/health-journal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-white to-[#e6f0ff] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-40 h-screen w-72
          bg-white border-r border-blue-100
          flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-blue-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <div className="w-5 h-5">{Icons.heart}</div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              MediCore AI
            </h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
              Healthcare Assistant
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Main Menu
          </p>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = item.path === "/dashboard";
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                    transition-all duration-200 group
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  <span
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-blue-500"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-blue-50">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-blue-50/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition group"
          >
            <span className="w-5 h-5 group-hover:scale-110 transition-transform">
              {Icons.logout}
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-blue-100 flex items-center justify-between px-5 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-blue-100 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            {/* Search */}
            <div className="relative hidden md:flex items-center w-full max-w-md">
              <div
                className={`flex items-center gap-2 bg-blue-50/70 border rounded-xl px-3.5 py-2.5 w-full transition ${
                  showSearchResults
                    ? "border-blue-300 ring-2 ring-blue-500/20"
                    : "border-blue-100"
                }`}
              >
                <span className="w-4 h-4 text-blue-400 flex-shrink-0">
                  {Icons.search}
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSearchResults(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }
                  }}
                  placeholder="Search symptoms, appointments, reports..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-100 transition"
                  >
                    <span className="w-3 h-3">{Icons.close}</span>
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-blue-100 shadow-2xl shadow-blue-500/10 overflow-hidden z-50">
                  {filteredSearchItems.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 mb-3">
                        <span className="w-5 h-5">{Icons.search}</span>
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No results found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Try searching for symptoms, appointments or reports
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        Search Results
                      </p>

                      {filteredSearchItems.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => handleSearchSelect(item.path)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-blue-50 transition group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-500 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all">
                            <span className="w-5 h-5">{item.icon}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                              {item.title}
                            </p>

                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {item.description}
                            </p>
                          </div>

                          <span className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform">
                            {Icons.arrow}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className={`w-10 h-10 rounded-xl border transition flex items-center justify-center relative ${
                  showNotifications
                    ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "border-blue-100 text-blue-500 hover:bg-blue-50"
                }`}
              >
                <span className="w-5 h-5">{Icons.bell}</span>

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md shadow-blue-500/40 ring-2 ring-white">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>

              {/* ===== Enhanced Notification Dropdown ===== */}
              {showNotifications && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 sm:hidden"
                    onClick={() => setShowNotifications(false)}
                  />

                  <div className="absolute right-0 mt-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl shadow-blue-500/15 border border-blue-100 z-50 overflow-hidden animate-notification-in">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 px-5 py-4">
                      <div className="absolute inset-0 opacity-20">
                        <svg
                          className="absolute top-0 right-0 w-24 h-24 text-white"
                          viewBox="0 0 100 100"
                          fill="currentColor"
                        >
                          <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
                        </svg>
                      </div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            <span className="w-4 h-4">{Icons.bell}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm">
                              Notifications
                            </h3>
                            <p className="text-[11px] text-blue-100 mt-0.5">
                              {notifications.length > 0
                                ? `${notifications.length} reminder${notifications.length > 1 ? "s" : ""}`
                                : "Your latest reminders"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition"
                        >
                          <span className="w-3.5 h-3.5">{Icons.close}</span>
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[380px] overflow-y-auto notification-scroll">
                      {notificationLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="w-10 h-10 rounded-full border-3 border-blue-100 border-t-blue-500 animate-spin"></div>
                          <p className="text-xs text-slate-400 mt-3 font-medium">
                            Loading notifications...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4">
                            <span className="w-8 h-8 text-blue-400">
                              {Icons.defaultBell}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            No notifications yet
                          </p>
                          <p className="text-xs text-slate-400 mt-1 text-center">
                            Your reminders will appear here
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 space-y-2">
                          {notifications.map((notification, index) => {
                            const colors = getNotificationColor(
                              notification.type,
                            );
                            return (
                              <div
                                key={notification._id}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className="group relative p-3.5 rounded-xl bg-gradient-to-br from-white to-blue-50/40 border border-blue-100/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer animate-notification-item"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon */}
                                  <div
                                    className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <span className="w-5 h-5">
                                      {getNotificationIcon(notification.type)}
                                    </span>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-bold text-slate-800 truncate">
                                        {notification.title}
                                      </p>
                                      <span
                                        className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${colors.lightBg} ${colors.text} flex-shrink-0`}
                                      >
                                        {notification.type}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                        <svg
                                          className="w-3 h-3 text-blue-400"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="16"
                                            rx="2"
                                          />
                                          <path d="M8 3v4M16 3v4M3 11h18" />
                                        </svg>
                                        {notification.date}
                                      </span>
                                      <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                        <svg
                                          className="w-3 h-3 text-blue-400"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <circle cx="12" cy="12" r="9" />
                                          <path d="M12 7v5l3 2" />
                                        </svg>
                                        {notification.time}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Hover accent line */}
                                <div
                                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 ${colors.bg} rounded-r-full transition-all duration-300`}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                        <button
                          onClick={() => {
                            navigate("/reminders");
                            setShowNotifications(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition group"
                        >
                          View All Reminders
                          <span className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                            {Icons.arrow}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-md shadow-blue-500/30 hover:scale-105 transition"
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* Welcome */}
          <section className="mb-8 animate-fade-in-up">
            <p className="text-sm font-bold text-blue-500 mb-2 uppercase tracking-widest">
              Welcome back 👋
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Hello, {user?.fullName || "User"}
            </h2>
            <p className="mt-2 text-slate-500">
              How can MediCore AI help you today?
            </p>
          </section>

          {/* ============ AI ASSISTANT HERO (with Robot) ============ */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8f2ff] via-[#f0f7ff] to-[#dbeafe] p-6 sm:p-8 border border-blue-100 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.25)] mb-10 animate-fade-in-up">
            {/* Hexagon Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <svg
                className="absolute top-[-30px] right-[30%] w-32 h-32 text-blue-300/40 animate-float"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
              <svg
                className="absolute bottom-[-40px] left-[20%] w-40 h-40 text-blue-300/30 animate-float-delayed"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
              <svg
                className="absolute top-10 left-[10%] w-16 h-16 text-blue-400/40"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
            </div>

            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              {/* Left: Text + Input */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <span className="w-5 h-5">{Icons.spark}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      MediCore AI Assistant
                    </p>
                    <p className="text-xs text-blue-500 font-semibold">
                      Your healthcare information companion
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                  How can I help you today?
                </h3>

                <p className="text-slate-600 mb-6 max-w-xl text-sm leading-relaxed">
                  Ask about general health information, explore health topics,
                  or prepare for your next medical appointment.
                </p>

                {/* Question Input */}
                <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg shadow-blue-500/10 border border-blue-100">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAsk();
                      }
                    }}
                    placeholder="Ask a health question..."
                    className="flex-1 px-4 py-3 text-slate-800 bg-transparent outline-none placeholder:text-slate-400 text-sm"
                  />
                  <button
                    onClick={handleAsk}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                  >
                    Ask MediCore
                    <span className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      {Icons.arrow}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  MediCore AI provides general health information and does not
                  replace professional medical advice.
                </p>
              </div>

              {/* Right: Robot Image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 animate-float">
                  {/* Glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-sky-400/30 rounded-full blur-3xl"></div>
                  {/* Robot Image */}
                  <img
                    src="./robo.png"
                    alt="AI Medical Robot"
                    className="relative w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                  />
                  {/* Floating badges */}
                  <div className="absolute -top-2 -left-2 bg-white rounded-xl px-3 py-1.5 shadow-lg border border-blue-100 flex items-center gap-1.5 animate-float-delayed">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-700">
                      Online
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-xl px-3 py-1.5 shadow-lg border border-blue-100 flex items-center gap-1.5">
                    <span className="w-3 h-3 text-blue-500">{Icons.spark}</span>
                    <span className="text-[10px] font-bold text-slate-700">
                      AI Powered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ QUICK ACTIONS ============ */}
          <section className="animate-fade-in-up">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Quick Actions
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Access MediCore AI features quickly
                </p>
              </div>
              <button
                onClick={() => navigate("/health-topics")}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 transition group"
              >
                View All
                <span className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  {Icons.arrow}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {quickActions.map((action, i) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="group text-left bg-white border border-blue-100 rounded-2xl p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-sm">
                    <span className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors duration-300">
                      {action.icon}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {action.title}
                  </h4>

                  <p className="text-sm text-slate-500 leading-6">
                    {action.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-bold text-blue-500">
                    Open
                    <span className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      {Icons.arrow}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes notification-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notification-item {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite 0.8s; }
        .animate-notification-in { animation: notification-in 0.3s ease-out both; }
        .animate-notification-item { animation: notification-item 0.4s ease-out both; }
        .notification-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .notification-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .notification-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #2563eb);
          border-radius: 10px;
        }
        .notification-scroll::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
