import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", formData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { text: "AI-powered health insights" },
    { text: "24/7 appointment prep" },
    { text: "HIPAA compliant & secure" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-white to-[#e6f0ff] flex items-center justify-center px-4 py-10">

      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-3xl animate-pulse-slower pointer-events-none"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.25)] overflow-hidden flex flex-col lg:flex-row animate-fade-in-up border border-blue-100">

        {/* ============ LEFT SECTION - INFO PANEL ============ */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-[#e8f2ff] via-[#f0f7ff] to-[#e0edff] p-8 lg:p-10 flex flex-col justify-between overflow-hidden">

          {/* Hexagon Pattern Background */}
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <svg className="absolute top-[-40px] right-[-40px] w-56 h-56 text-blue-300/40" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute top-32 right-16 w-32 h-32 text-blue-400/30 animate-float" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute bottom-24 right-[-20px] w-40 h-40 text-blue-300/40" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute top-24 right-48 w-16 h-16 text-blue-400/40 animate-float-delayed" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute bottom-48 right-8 w-20 h-20 text-blue-500/30 animate-float" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute top-10 right-24 w-24 h-24 text-blue-400/50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
            <svg className="absolute bottom-10 right-32 w-28 h-28 text-blue-400/50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <h2 className="text-slate-800 text-xl font-bold tracking-tight leading-tight">MediAI</h2>
                <p className="text-blue-500 text-[10px] tracking-widest uppercase font-bold">AI Healthcare</p>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide shadow-sm">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              AI-POWERED ASSISTANCE
            </div>

            {/* Heading */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Welcome
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                Back.
              </span>
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-8">
              Sign in to continue managing your health with AI-driven
              insights, diagnostics, and personalized recommendations.
            </p>

            {/* Feature List */}
            <div className="space-y-3">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="relative z-10 mt-8 pt-5 border-t border-blue-200 flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              HIPAA
            </div>
            <div className="w-px h-4 bg-blue-300"></div>
            <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              256-bit SSL
            </div>
          </div>
        </div>

        {/* ============ RIGHT SECTION - FORM ============ */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-10 flex items-center justify-center">

          <div className="w-full max-w-sm">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800">MediAI</span>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1.5">
                Login
              </h2>
              <p className="text-slate-500 text-sm">
                Welcome back! Please sign in to your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-blue-500 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-0 py-2.5 bg-transparent border-b-2 border-slate-200 outline-none focus:border-blue-500 transition-all duration-300 text-slate-800 placeholder-slate-300 text-sm font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-blue-500 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-0 pr-10 py-2.5 bg-transparent border-b-2 border-slate-200 outline-none focus:border-blue-500 transition-all duration-300 text-slate-800 placeholder-slate-300 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 rounded-full border-2 border-slate-300 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Remember me</span>
                </label>
                <span className="text-[11px] text-blue-500 font-semibold hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg px-3.5 py-2.5 text-xs font-medium animate-shake">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 group mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition"
              >
                Create Account
              </Link>
            </p>

            {/* Demo Credentials */}
            <div className="mt-5 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Demo Credentials</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono pl-5">user@gmail.com / user</p>
            </div>

          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite 1s; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slow 10s ease-in-out infinite 2s; }
      `}</style>

    </div>
  );
};

export default Login;