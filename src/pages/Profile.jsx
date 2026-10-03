import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:5000/api/profile";

  // ================= FETCH PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/${userId}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        console.log("Profile loaded:", response.data);

        setProfile(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  // ================= OPEN EDIT FORM =================

  const openEditForm = () => {
    setEditForm({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
    });

    setShowEditForm(true);
  };

  // ================= HANDLE INPUT =================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE PASSWORD INPUT =================

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE PROFILE =================

  const handleSaveProfile = async () => {
    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    if (!editForm.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
      };

      console.log("Sending profile update:", updateData);

      const response = await axios.put(`${API_URL}/${userId}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      console.log("Profile update response:", response.data);

      // Make sure backend returned updated profile
      if (!response.data) {
        throw new Error("No profile data returned from server.");
      }

      // ================= UPDATE UI =================

      setProfile(response.data);

      // ================= UPDATE LOCAL STORAGE =================

      const updatedUser = {
        ...user,
        id: response.data._id || user.id,
        fullName: response.data.fullName,
        phone: response.data.phone || "",
        email: response.data.email || user.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ================= CLOSE MODAL =================

      setShowEditForm(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      console.error("Server response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      alert("New password must be different from your current password.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        },
      );

      console.log("Change password response:", response.data);

      alert(response.data?.message || "Password changed successfully!");

      // Clear password fields
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close modal
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Change password error:", error);

      console.error("Server response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ================= LOGOUT =================

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="pf-root">
        <div className="pf-bg" aria-hidden="true">
          <div className="pf-blob b1" />
          <div className="pf-blob b2" />
          <div className="pf-blob b3" />
          <div className="pf-hex h1" />
          <div className="pf-hex h2" />
          <div className="pf-hex h3" />
          <div className="pf-grid-overlay" />
        </div>

        <div className="pf-wrapper">
          <div className="pf-loading">
            <div className="pf-spinner">
              <div className="pf-spinner-ring" />
              <div className="pf-spinner-core" />
            </div>

            <p className="pf-loading-text">Loading your profile...</p>
          </div>
        </div>

        <style>{profileStyles}</style>
      </div>
    );
  }

  // ================= PROFILE NOT FOUND =================

  if (!profile) {
    return (
      <div className="pf-root">
        <div className="pf-bg" aria-hidden="true">
          <div className="pf-blob b1" />
          <div className="pf-blob b2" />
          <div className="pf-blob b3" />
          <div className="pf-hex h1" />
          <div className="pf-hex h2" />
          <div className="pf-hex h3" />
          <div className="pf-grid-overlay" />
        </div>

        <div className="pf-wrapper">
          <div className="pf-error">
            <div className="pf-error-icon">!</div>

            <h2 className="pf-error-title">Profile not found</h2>

            <p className="pf-error-text">
              We couldn't load your profile information.
            </p>
          </div>
        </div>

        <style>{profileStyles}</style>
      </div>
    );
  }

  return (
    <div className="pf-root">
      <style>{profileStyles}</style>

      {/* ================= BACKGROUND ================= */}

      <div className="pf-bg" aria-hidden="true">
        <div className="pf-blob b1" />
        <div className="pf-blob b2" />
        <div className="pf-blob b3" />
        <div className="pf-blob b4" />

        <div className="pf-hex h1" />
        <div className="pf-hex h2" />
        <div className="pf-hex h3" />
        <div className="pf-hex h4" />
        <div className="pf-hex h5" />

        <div className="pf-grid-overlay" />
      </div>

      <div className="pf-wrapper">
        {/* ================= HEADER ================= */}

        <header className="pf-header">
          <div className="pf-header-left">
            <div className="pf-logo">
              <div className="pf-logo-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="pf-logo-ring" />
            </div>

            <div>
              <h1 className="pf-title">My Profile</h1>

              <p className="pf-subtitle">
                <span className="pf-pulse-dot" />
                Manage your personal information and account settings
              </p>
            </div>
          </div>

          <button
            className="pf-primary-btn"
            onClick={openEditForm}
            type="button"
          >
            <span className="pf-btn-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1-1-4Z" />
              </svg>
            </span>

            <span>Edit Profile</span>

            <span className="pf-btn-shine" />
          </button>
        </header>

        {/* ================= HERO CARD ================= */}

        <div className="pf-hero-card">
          <div className="pf-hero-glow" />

          <div className="pf-avatar">
            <div className="pf-avatar-inner">
              {profile.fullName
                ? profile.fullName.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="pf-avatar-ring" />
          </div>

          <div className="pf-hero-info">
            <h2 className="pf-hero-name">{profile.fullName}</h2>

            <p className="pf-hero-email">{profile.email}</p>

            <span className="pf-badge">
              <span className="pf-badge-dot" />
              Active Account
            </span>
          </div>

          <div className="pf-hero-stats">
            <div className="pf-hero-stat">
              <p className="pf-hero-stat-value">Verified</p>

              <p className="pf-hero-stat-label">Email Status</p>
            </div>

            <div className="pf-hero-stat">
              <p className="pf-hero-stat-value">Secured</p>

              <p className="pf-hero-stat-label">Account</p>
            </div>
          </div>
        </div>

        {/* ================= EDIT PROFILE MODAL ================= */}

        {showEditForm && (
          <div className="pf-edit-overlay">
            <div className="pf-edit-modal">
              <div className="pf-edit-header">
                <div>
                  <h2>Edit Profile</h2>

                  <p>Update your basic account information</p>
                </div>

                <button
                  type="button"
                  className="pf-edit-close"
                  onClick={() => setShowEditForm(false)}
                  disabled={saving}
                >
                  ×
                </button>
              </div>

              <div className="pf-edit-form">
                {/* Full Name */}

                <div className="pf-edit-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={saving}
                  />
                </div>

                {/* Email */}

                <div className="pf-edit-field">
                  <label>Email Address</label>

                  <input type="email" value={profile.email || ""} disabled />

                  <small>Email address cannot be changed here.</small>
                </div>

                {/* Phone */}

                <div className="pf-edit-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={saving}
                  />
                </div>

                {/* Buttons */}

                <div className="pf-edit-actions">
                  <button
                    type="button"
                    className="pf-cancel-btn"
                    onClick={() => setShowEditForm(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="pf-save-btn"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CHANGE PASSWORD MODAL ================= */}

        {showPasswordForm && (
          <div className="pf-edit-overlay">
            <div className="pf-edit-modal">
              <div className="pf-edit-header">
                <div>
                  <h2>Change Password</h2>

                  <p>Update your account password securely</p>
                </div>

                <button
                  type="button"
                  className="pf-edit-close"
                  onClick={() => {
                    if (!changingPassword) {
                      setShowPasswordForm(false);

                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }
                  }}
                  disabled={changingPassword}
                >
                  ×
                </button>
              </div>

              <div className="pf-edit-form">
                {/* Current Password */}

                <div className="pf-edit-field">
                  <label>Current Password</label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your current password"
                    disabled={changingPassword}
                  />
                </div>

                {/* New Password */}

                <div className="pf-edit-field">
                  <label>New Password</label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your new password"
                    disabled={changingPassword}
                  />

                  <small>Password must be at least 6 characters.</small>
                </div>

                {/* Confirm Password */}

                <div className="pf-edit-field">
                  <label>Confirm New Password</label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm your new password"
                    disabled={changingPassword}
                  />
                </div>

                {/* Buttons */}

                <div className="pf-edit-actions">
                  <button
                    type="button"
                    className="pf-cancel-btn"
                    onClick={() => {
                      if (!changingPassword) {
                        setShowPasswordForm(false);

                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }
                    }}
                    disabled={changingPassword}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="pf-save-btn"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MAIN GRID ================= */}

        <div className="pf-content-grid">
          {/* Personal Information */}

          <div className="pf-card">
            <div className="pf-card-glow blue" />

            <div className="pf-card-heading">
              <div className="pf-heading-icon blue-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div>
                <h3 className="pf-card-title">Profile Information</h3>

                <p className="pf-card-subtitle">
                  Your basic account information
                </p>
              </div>
            </div>

            <div className="pf-fields">
              {/* Full Name */}

              <div className="pf-field">
                <label className="pf-label">Full Name</label>

                <div className="pf-field-value">
                  <div className="pf-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <span>{profile.fullName}</span>
                </div>
              </div>

              {/* Email */}

              <div className="pf-field">
                <label className="pf-label">Email Address</label>

                <div className="pf-field-value">
                  <div className="pf-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>

                  <span>{profile.email}</span>
                </div>
              </div>

              {/* Phone */}

              <div className="pf-field">
                <label className="pf-label">Phone Number</label>

                <div className="pf-field-value">
                  <div className="pf-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>

                  <span className={!profile.phone ? "pf-muted" : ""}>
                    {profile.phone || "Not added"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="pf-outline-btn"
              onClick={openEditForm}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1-1-4Z" />
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Account Settings */}

          <div className="pf-card">
            <div className="pf-card-glow violet" />

            <div className="pf-card-heading">
              <div className="pf-heading-icon purple-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.61.7 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>

              <div>
                <h3 className="pf-card-title">Account Settings</h3>

                <p className="pf-card-subtitle">Manage your account security</p>
              </div>
            </div>

            <div className="pf-settings-list">
              <button type="button" className="pf-setting-item" onClick={() => setShowPasswordForm(true)}>
                <div className="pf-setting-left">
                  <div className="pf-setting-icon password-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>

                  <div>
                    <strong>Change Password</strong>

                    <span>Update your account password</span>
                  </div>
                </div>

                <svg
                  className="pf-arrow-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <button
                type="button"
                className="pf-setting-item logout-item"
                onClick={handleLogout}
              >
                <div className="pf-setting-left">
                  <div className="pf-setting-icon logout-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                  </div>

                  <div>
                    <strong>Logout</strong>

                    <span>Sign out of your MediAI account</span>
                  </div>
                </div>

                <svg
                  className="pf-arrow-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ================= PRIVACY NOTICE ================= */}

        <div className="pf-privacy">
          <div className="pf-privacy-glow" />

          <div className="pf-privacy-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <strong className="pf-privacy-title">Your privacy matters</strong>

            <p className="pf-privacy-text">
              MediAI only uses the information needed to manage your account. We
              don't ask for unnecessary medical information in your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const profileStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
  }

  .pf-root {
    position: relative;
    min-height: 100vh;
    padding: 40px 16px 80px;
    overflow-x: hidden;
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #eef4ff 0%, #f7faff 40%, #eaf1ff 100%);
    color: #0f172a;
  }

  .pf-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .pf-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.55;
  }

  .pf-blob.b1 {
    width: 420px;
    height: 420px;
    background: #bfdbfe;
    top: 5%;
    left: 8%;
    animation: pf-float1 18s ease-in-out infinite;
  }

  .pf-blob.b2 {
    width: 360px;
    height: 360px;
    background: #c7d2fe;
    bottom: 8%;
    right: 8%;
    animation: pf-float2 20s ease-in-out infinite;
  }

  .pf-blob.b3 {
    width: 280px;
    height: 280px;
    background: #a5f3fc;
    top: 40%;
    right: 28%;
    animation: pf-float3 16s ease-in-out infinite;
  }

  .pf-blob.b4 {
    width: 200px;
    height: 200px;
    background: #ddd6fe;
    bottom: 25%;
    left: 20%;
    animation: pf-float1 22s ease-in-out infinite reverse;
  }

  .pf-hex {
    position: absolute;
    background: linear-gradient(
      135deg,
      rgba(59,130,246,0.10),
      rgba(99,102,241,0.05)
    );
    clip-path: polygon(
      50% 0%,
      100% 25%,
      100% 75%,
      50% 100%,
      0% 75%,
      0% 25%
    );
    animation: pf-hexPulse 8s ease-in-out infinite;
  }

  .pf-hex.h1 {
    top: -60px;
    left: -80px;
    width: 220px;
    height: 220px;
  }

  .pf-hex.h2 {
    top: 20%;
    right: -100px;
    width: 300px;
    height: 300px;
    animation-delay: 1s;
  }

  .pf-hex.h3 {
    bottom: -80px;
    left: 15%;
    width: 260px;
    height: 260px;
    animation-delay: 2s;
  }

  .pf-hex.h4 {
    top: 55%;
    left: -40px;
    width: 140px;
    height: 140px;
    animation-delay: 3s;
  }

  .pf-hex.h5 {
    top: 8%;
    right: 30%;
    width: 100px;
    height: 100px;
    animation-delay: 4s;
  }

  .pf-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(59,130,246,0.06) 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    opacity: 0.5;
  }

  .pf-wrapper {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  .pf-header {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 30px;
    animation: pf-fadeUp 0.6s ease both;
  }

  @media (min-width: 720px) {
    .pf-header {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .pf-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pf-logo {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    box-shadow: 0 10px 28px rgba(59,130,246,0.38);
  }

  .pf-logo-inner {
    color: white;
    display: grid;
    place-items: center;
    z-index: 1;
  }

  .pf-logo-inner svg {
    width: 28px;
    height: 28px;
  }

  .pf-logo-ring {
    position: absolute;
    inset: -4px;
    border-radius: 22px;
    border: 2px solid rgba(59,130,246,0.25);
    animation: pf-ringPulse 2.5s ease-in-out infinite;
  }

  .pf-title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    background: linear-gradient(
      135deg,
      #1e3a8a 0%,
      #3b82f6 60%,
      #6366f1 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pf-subtitle {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pf-pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    animation: pf-pulseDot 2s infinite;
  }

  .pf-primary-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 14px 24px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(59,130,246,0.35);
    overflow: hidden;
  }

  .pf-primary-btn svg {
    width: 17px;
    height: 17px;
  }

  .pf-btn-icon {
    display: grid;
    place-items: center;
  }

  .pf-btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  .pf-primary-btn:hover .pf-btn-shine {
    left: 100%;
  }

  .pf-hero-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 28px 30px;
    margin-bottom: 26px;
    border-radius: 24px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.92);
    backdrop-filter: blur(14px);
    box-shadow: 0 15px 40px rgba(59,130,246,0.10);
    overflow: hidden;
  }

  .pf-hero-glow {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(99,102,241,0.15),
      transparent 70%
    );
  }

  .pf-avatar {
    position: relative;
    width: 88px;
    height: 88px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 26px;
    background: linear-gradient(135deg, #4f8df7, #667eea);
    box-shadow: 0 12px 30px rgba(79,141,247,0.32);
  }

  .pf-avatar-inner {
    color: white;
    font-size: 34px;
    font-weight: 800;
    z-index: 1;
  }

  .pf-avatar-ring {
    position: absolute;
    inset: -6px;
    border-radius: 32px;
    border: 2px solid rgba(79,141,247,0.28);
    animation: pf-ringPulse 2.8s ease-in-out infinite;
  }

  .pf-hero-info {
    flex: 1;
    min-width: 0;
  }

  .pf-hero-name {
    margin: 0 0 6px;
    color: #0f172a;
    font-size: 22px;
    font-weight: 800;
    word-break: break-word;
  }

  .pf-hero-email {
    margin: 0 0 12px;
    color: #64748b;
    font-size: 13.5px;
    word-break: break-word;
  }

  .pf-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 999px;
    background: #effcf5;
    color: #26915a;
    font-size: 11px;
    font-weight: 700;
  }

  .pf-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #35b878;
    animation: pf-pulseDot 2s infinite;
  }

  .pf-hero-stats {
    display: flex;
    gap: 22px;
    padding-left: 22px;
    border-left: 1px solid rgba(148,163,184,0.20);
  }

  .pf-hero-stat {
    text-align: left;
  }

  .pf-hero-stat-value {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #2563eb;
  }

  .pf-hero-stat-label {
    margin: 3px 0 0;
    font-size: 10.5px;
    font-weight: 600;
    color: #64748b;
  }

  .pf-content-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 22px;
    margin-bottom: 24px;
  }

  .pf-card {
    position: relative;
    padding: 26px;
    border-radius: 22px;
    background: rgba(255,255,255,0.80);
    border: 1px solid rgba(255,255,255,0.92);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 35px rgba(59,130,246,0.08);
    overflow: hidden;
  }

  .pf-card-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.20;
    pointer-events: none;
  }

  .pf-card-glow.blue {
    background: #3b82f6;
  }

  .pf-card-glow.violet {
    background: #8b5cf6;
  }

  .pf-card-heading {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(148,163,184,0.15);
  }

  .pf-heading-icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 14px;
  }

  .pf-heading-icon svg {
    width: 22px;
    height: 22px;
  }

  .blue-icon {
    color: #4c88f5;
    background: linear-gradient(135deg, #edf4ff, #e0edff);
  }

  .purple-icon {
    color: #7569e8;
    background: linear-gradient(135deg, #f1efff, #ede9fe);
  }

  .pf-card-title {
    margin: 0 0 4px;
    color: #0f172a;
    font-size: 15.5px;
    font-weight: 800;
  }

  .pf-card-subtitle {
    margin: 0;
    color: #64748b;
    font-size: 11.5px;
  }

  .pf-fields {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px 0;
  }

  .pf-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pf-label {
    color: #2563eb;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .pf-field-value {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    padding: 0 15px;
    border: 1.5px solid rgba(148,163,184,0.20);
    border-radius: 13px;
    background: rgba(248,250,253,0.85);
    color: #1e293b;
    font-size: 13px;
    font-weight: 600;
  }

  .pf-field-icon {
    display: grid;
    place-items: center;
    color: #3b82f6;
    flex-shrink: 0;
  }

  .pf-field-icon svg {
    width: 17px;
    height: 17px;
  }

  .pf-muted {
    color: #94a3b8;
    font-style: italic;
    font-weight: 500;
  }

  .pf-outline-btn {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px;
    border: 1.5px solid rgba(59,130,246,0.22);
    border-radius: 13px;
    background: linear-gradient(135deg, #f7faff, #eff6ff);
    color: #2563eb;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .pf-outline-btn svg {
    width: 15px;
    height: 15px;
  }

  .pf-settings-list {
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pf-setting-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
  }

  .pf-setting-left {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
  }

  .pf-setting-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 13px;
  }

  .pf-setting-icon svg {
    width: 19px;
    height: 19px;
  }

  .password-icon {
    color: #6478d9;
    background: linear-gradient(135deg, #f0f2ff, #e8ecff);
  }

  .logout-icon {
    color: #e46d7a;
    background: linear-gradient(135deg, #fff1f3, #ffe4e8);
  }

  .pf-setting-left strong {
    display: block;
    margin-bottom: 4px;
    color: #1e293b;
    font-size: 13px;
    font-weight: 700;
  }

  .pf-setting-left span {
    display: block;
    color: #64748b;
    font-size: 11px;
  }

  .pf-arrow-icon {
    width: 18px;
    height: 18px;
    color: #94a3b8;
    flex-shrink: 0;
  }

  .logout-item .pf-setting-left strong {
    color: #dc5968;
  }

  .pf-privacy {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px 22px;
    border-radius: 20px;
    background: linear-gradient(135deg, #eff6ff 0%, #eef4ff 100%);
    border: 1px solid rgba(59,130,246,0.16);
    box-shadow: 0 10px 30px rgba(59,130,246,0.08);
    overflow: hidden;
  }

  .pf-privacy-glow {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(59,130,246,0.12);
    filter: blur(35px);
  }

  .pf-privacy-icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 14px;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
  }

  .pf-privacy-icon svg {
    width: 21px;
    height: 21px;
  }

  .pf-privacy-title {
    display: block;
    margin-bottom: 5px;
    color: #1e3a8a;
    font-size: 13.5px;
    font-weight: 800;
  }

  .pf-privacy-text {
    margin: 0;
    color: #1e40af;
    font-size: 12.5px;
    line-height: 1.7;
  }

  .pf-loading,
  .pf-error {
    min-height: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 25px;
    border-radius: 22px;
    background: rgba(255,255,255,0.60);
    backdrop-filter: blur(14px);
  }

  .pf-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin-bottom: 18px;
  }

  .pf-spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid #dbeafe;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: pf-spin 1s linear infinite;
  }

  .pf-spinner-core {
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
  }

  .pf-loading-text {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
  }

  .pf-error-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    margin-bottom: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff1f2, #ffe4e8);
    color: #dc5968;
    font-size: 26px;
    font-weight: 800;
  }

  .pf-error-title {
    margin: 0 0 6px;
    color: #0f172a;
    font-size: 18px;
    font-weight: 800;
  }

  .pf-error-text {
    margin: 0;
    color: #64748b;
    font-size: 13px;
  }

  /* ================= EDIT MODAL ================= */

  .pf-edit-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(15,23,42,0.45);
    backdrop-filter: blur(8px);
    animation: pf-modalFade 0.25s ease both;
  }

  .pf-edit-modal {
    position: relative;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    background: rgba(255,255,255,0.97);
    border: 1px solid rgba(255,255,255,0.95);
    border-radius: 24px;
    box-shadow:
      0 30px 80px rgba(15,23,42,0.25),
      0 10px 30px rgba(59,130,246,0.12);
    animation: pf-modalUp 0.3s ease both;
  }

  .pf-edit-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 26px;
    border-bottom: 1px solid rgba(148,163,184,0.16);
  }

  .pf-edit-header h2 {
    margin: 0 0 6px;
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
  }

  .pf-edit-header p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  .pf-edit-close {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    padding: 0;
    border: none;
    border-radius: 10px;
    background: #f1f5f9;
    color: #64748b;
    font-family: inherit;
    font-size: 23px;
    cursor: pointer;
  }

  .pf-edit-form {
    padding: 26px;
  }

  .pf-edit-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .pf-edit-field label {
    color: #2563eb;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .pf-edit-field input {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border: 1.5px solid rgba(148,163,184,0.22);
    border-radius: 13px;
    outline: none;
    background: #f8fafc;
    color: #1e293b;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
  }

  .pf-edit-field input:focus {
    border-color: rgba(59,130,246,0.60);
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
  }

  .pf-edit-field input:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }

  .pf-edit-field small {
    color: #94a3b8;
    font-size: 10.5px;
  }

  .pf-edit-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 26px;
  }

  .pf-cancel-btn,
  .pf-save-btn {
    min-height: 44px;
    padding: 0 20px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .pf-cancel-btn {
    border: 1px solid rgba(148,163,184,0.25);
    background: #f8fafc;
    color: #64748b;
  }

  .pf-save-btn {
    border: none;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    box-shadow: 0 8px 20px rgba(59,130,246,0.25);
  }

  .pf-save-btn:disabled,
  .pf-cancel-btn:disabled,
  .pf-edit-close:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @keyframes pf-modalFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pf-modalUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pf-fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pf-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pf-pulseDot {
    0% {
      box-shadow: 0 0 0 0 rgba(16,185,129,0.5);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(16,185,129,0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16,185,129,0);
    }
  }

  @keyframes pf-ringPulse {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 0.2;
      transform: scale(1.06);
    }
  }

  @keyframes pf-float1 {
    0%, 100% {
      transform: translate(0,0) scale(1);
    }
    33% {
      transform: translate(30px,-20px) scale(1.05);
    }
    66% {
      transform: translate(-20px,20px) scale(0.95);
    }
  }

  @keyframes pf-float2 {
    0%, 100% {
      transform: translate(0,0) scale(1);
    }
    33% {
      transform: translate(-25px,25px) scale(1.08);
    }
    66% {
      transform: translate(25px,-15px) scale(0.92);
    }
  }

  @keyframes pf-float3 {
    0%, 100% {
      transform: translate(0,0) scale(1);
    }
    50% {
      transform: translate(20px,30px) scale(1.1);
    }
  }

  @keyframes pf-hexPulse {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.05) rotate(5deg);
    }
  }

  @media (max-width: 900px) {
    .pf-content-grid {
      grid-template-columns: 1fr;
    }

    .pf-hero-stats {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .pf-root {
      padding: 24px 14px 60px;
    }

    .pf-title {
      font-size: 24px;
    }

    .pf-logo {
      width: 48px;
      height: 48px;
    }

    .pf-logo-inner svg {
      width: 24px;
      height: 24px;
    }

    .pf-header {
      margin-bottom: 25px;
    }

    .pf-primary-btn {
      width: 100%;
    }

    .pf-hero-card {
      flex-direction: column;
      text-align: center;
      padding: 24px 20px;
    }

    .pf-hero-info {
      text-align: center;
    }

    .pf-avatar {
      width: 76px;
      height: 76px;
      border-radius: 22px;
    }

    .pf-avatar-inner {
      font-size: 30px;
    }

    .pf-card {
      padding: 20px;
    }

    .pf-privacy {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .pf-edit-overlay {
      padding: 14px;
    }

    .pf-edit-modal {
      max-height: 92vh;
      border-radius: 20px;
    }

    .pf-edit-header {
      padding: 20px;
    }

    .pf-edit-form {
      padding: 20px;
    }

    .pf-edit-actions {
      flex-direction: column-reverse;
    }

    .pf-cancel-btn,
    .pf-save-btn {
      width: 100%;
    }
  }
`;

export default Profile;
