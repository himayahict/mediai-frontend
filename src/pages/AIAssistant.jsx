import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.question || "");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const autoSentRef = useRef(false);
  
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const userId = user?._id || user?.id;

        if (!userId) return;

        const response = await API.get(`/api/chats/${userId}`);

        if (response.data.success) {
          const history = response.data.chats.map((chat) => ({
            id: chat._id,
            title: chat.title,
            messages: chat.messages,
          }));

          setChatHistory(history);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadChatHistory();
  }, []);

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await API.delete(`/api/chats/${chatId}`);

      if (response.data.success) {
        // Remove chat from sidebar
        setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

        // If deleted chat is currently open
        if (activeChatId === chatId) {
          setMessages([]);
          setActiveChatId(null);
        }

        console.log("Chat deleted successfully");
      }
    } catch (error) {
      console.error("Delete chat error:", error);
    }
  };

  const handleSend = async (customMessage = null) => {
  const currentMessage = customMessage ?? message;

  if (!currentMessage.trim() || loading) return;

  const userMessage = currentMessage.trim();

    const newUserMessage = {
      role: "user",
      text: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/api/ai/chat", {
        message: userMessage,
        history: messages,
      });

      const newAssistantMessage = {
        role: "assistant",
        text: response.data.aiResponse,
      };

      const updatedMessages = [
        ...messages,
        newUserMessage,
        newAssistantMessage,
      ];

      setMessages(updatedMessages);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?._id || user?.id) {
        const userId = user._id || user.id;

        if (!activeChatId) {
          // Create a new chat
          const chatResponse = await API.post("/api/chats", {
            userId,
            title: userMessage,
            messages: updatedMessages,
          });

          if (chatResponse.data.success) {
            setActiveChatId(chatResponse.data.chat._id);

            console.log("New Chat ID:", chatResponse.data.chat._id);
          }
        } else {
          console.log("Updating Chat ID:", activeChatId);
          console.log("Messages being saved:", updatedMessages);

          // Update existing chat
          await API.put(`/api/chats/${activeChatId}`, {
            messages: updatedMessages,
          });
          console.log("Chat update request completed");
        }
      }
    } catch (error) {
      console.error("AI request error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't get a response right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
  const initialQuestion = location.state?.question;

  if (initialQuestion && !autoSentRef.current) {
    autoSentRef.current = true;

    handleSend(initialQuestion);

    // Clear the navigation state
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  // ===== SVG Icons (same blue pattern) =====
  const Icons = {
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
    send: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
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
    chat: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a8 8 0 0 1-8 8H8l-5 3v-5a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
        <path d="M5 3v6a5 5 0 0 0 10 0V3" />
        <path d="M3 3h4M13 3h4" />
        <path d="M10 14v2a5 5 0 0 0 10 0v-3" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    moon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
    info: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v5h1" />
      </svg>
    ),
    user: (
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
  };

  const suggestions = [
    "What are the symptoms of high blood pressure?",
    "How can I improve my sleep quality?",
    "What foods help manage diabetes?",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-white to-[#e6f0ff] p-4 sm:p-6">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-3xl animate-pulse-slower pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* ============ HEADER ============ */}
        <div className="mb-6 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="w-6 h-6 text-white">{Icons.spark}</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Assistant
              </h1>
              <p className="text-slate-500 text-sm">
                Your healthcare information companion
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-blue-100 rounded-full px-3.5 py-1.5 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600">Online</span>
          </div>
        </div>

        {/* ============ MAIN CARD ============ */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.25)] border border-blue-100 overflow-hidden flex min-h-[650px] animate-fade-in-up">
          {/* ============ LEFT SIDEBAR ============ */}
          <div className="hidden lg:flex w-72 flex-col bg-gradient-to-br from-[#e8f2ff] via-[#f0f7ff] to-[#e0edff] border-r border-blue-100 relative overflow-hidden">
            {/* Hexagon Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <svg
                className="absolute top-[-30px] right-[-30px] w-40 h-40 text-blue-300/40"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
              <svg
                className="absolute bottom-[-40px] left-[-20px] w-32 h-32 text-blue-300/30 animate-float"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
              <svg
                className="absolute top-1/2 right-4 w-16 h-16 text-blue-400/40 animate-float-delayed"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              </svg>
            </div>

            <div className="relative z-10 p-5 flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <span className="w-5 h-5">{Icons.heart}</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    MediCore AI
                  </h2>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                    Assistant
                  </p>
                </div>
              </div>

              {/* New Chat Button */}
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                onClick={() => {
                  setMessages([]);
                  setMessage("");
                  setActiveChatId(null);
                }}
              >
                <span className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300">
                  {Icons.plus}
                </span>
                New Chat
              </button>

              {/* Recent Chats */}
              <div className="mt-8 flex-1">
                <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 px-2">
                  Recent Chats
                </h2>
                <div className="space-y-1">
                  {chatHistory.length === 0 ? (
                    <p className="text-xs text-slate-400 px-2">
                      No recent chats yet.
                    </p>
                  ) : (
                    chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/70 group"
                      >
                        {/* Open Chat */}
                        <button
                          onClick={() => {
                            setMessages(chat.messages);
                            setActiveChatId(chat.id);
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left text-slate-700 hover:text-blue-600 transition-all duration-200"
                        >
                          <span className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform flex-shrink-0">
                            {Icons.chat}
                          </span>

                          <span className="text-sm font-semibold truncate">
                            {chat.title}
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteChat(chat.id)}
                          className="p-2 text-blue-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete chat"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5">
                    {Icons.info}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    MediCore AI provides general info only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============ CHAT AREA ============ */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="border-b border-blue-100 p-5 flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="w-6 h-6 text-white">{Icons.spark}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  MediCore AI
                </h2>
                <p className="text-xs text-slate-500">
                  Ask general health questions
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-600">
                  Active
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="max-w-2xl mx-auto text-center mt-10 sm:mt-16 animate-fade-in">
                  {/* Robot Icon */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-sky-400/30 rounded-full blur-2xl"></div>

                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 animate-float">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 text-white">
                        {Icons.spark}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                    Hello! 👋
                  </h2>

                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    How can I help you today? Ask me anything about general
                    health information.
                  </p>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setMessage(s)}
                        style={{ animationDelay: `${i * 100}ms` }}
                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-300 text-blue-600 text-xs font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/10 animate-fade-in-up"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="max-w-3xl mx-auto space-y-5">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-blue-50 border border-blue-100 text-slate-800"
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                            msg.role === "user"
                              ? "text-blue-100"
                              : "text-blue-500"
                          }`}
                        >
                          {msg.role === "user" ? "You" : "MediCore AI"}
                        </p>

                        <div className="text-sm leading-7 prose prose-sm max-w-none">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                        <p className="text-xs font-bold text-blue-500 mb-1">
                          MediCore AI
                        </p>

                        <p className="text-sm text-slate-500">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-blue-100 p-4 sm:p-5 bg-gradient-to-b from-white to-blue-50/30">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2 bg-white rounded-2xl border-2 border-blue-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200 p-1.5 shadow-lg shadow-blue-500/5">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSend();
                      }
                    }}
                    placeholder="Ask your health question..."
                    className="flex-1 px-4 py-2.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                  />

                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group"
                    aria-label="Send message"
                  >
                    <span className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      {Icons.send}
                    </span>
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <span className="w-3.5 h-3.5 text-slate-400">
                    {Icons.info}
                  </span>
                  <p className="text-[11px] text-slate-400 text-center font-medium">
                    MediCore AI provides general health information and is not a
                    replacement for professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
        .animate-fade-in { animation: fade-in 0.6s ease-out both; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slow 10s ease-in-out infinite 2s; }
      `}</style>
    </div>
  );
};

export default AIAssistant;
