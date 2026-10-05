import { useState, useEffect } from "react";
import axios from "axios";

const Documents = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    type: "Lab Report",
    file: null,
  });

  // ===== Icons =====
  const Icons = {
    document: (
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

    upload: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
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
        <path d="m20 20-4-4" />
      </svg>
    ),

    filter: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    ),

    eye: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),

    download: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4v11" />
        <path d="m7 11 5 5 5-5" />
        <path d="M5 20h14" />
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
        <path d="M3 6h18" />
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
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

    check: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Documents response:", response.data);

      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error(
        "Fetch documents error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleViewDocument = (doc) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}${doc.fileUrl}`;

    window.open(fileUrl, "_blank");
  };

  const handleDownloadDocument = (doc) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}${doc.fileUrl}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.fileName;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      if (!formData.file) {
        alert("Please select a file.");
        return;
      }

      const data = new FormData();

      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("file", formData.file);

      console.log("Document form data:", formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Upload response:", response.data);

      if (response.data.success) {
        alert("Document uploaded successfully!");

        setShowUploadForm(false);

        setFormData({
          title: "",
          type: "Lab Report",
          file: null,
        });
      }
    } catch (error) {
      console.error(
        "Document upload error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to upload document.");
    }
  };

  const handleDeleteDocument = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${doc.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${doc._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted document from UI
      setDocuments((prevDocuments) =>
        prevDocuments.filter((item) => item._id !== doc._id),
      );

      alert("Document deleted successfully");
    } catch (error) {
      console.error("Delete document error:", error);

      alert(error.response?.data?.message || "Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      doc.title.toLowerCase().includes(search) ||
      doc.fileName.toLowerCase().includes(search) ||
      doc.type.toLowerCase().includes(search);

    const matchesType = documentType === "All" || doc.type === documentType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="doc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .doc-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding: 40px 16px 80px;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(
            135deg,
            #eef4ff 0%,
            #f7faff 40%,
            #eaf1ff 100%
          );
          color: #0f172a;
        }

        /* ================= BACKGROUND ================= */

        .doc-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .doc-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
        }

        .doc-blob.b1 {
          width: 380px;
          height: 380px;
          background: #bfdbfe;
          top: 5%;
          left: 10%;
        }

        .doc-blob.b2 {
          width: 320px;
          height: 320px;
          background: #c7d2fe;
          bottom: 10%;
          right: 10%;
        }

        .doc-blob.b3 {
          width: 260px;
          height: 260px;
          background: #a5f3fc;
          top: 40%;
          right: 30%;
        }

        .doc-hex {
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
        }

        .doc-hex.h1 {
          top: -60px;
          left: -80px;
          width: 220px;
          height: 220px;
        }

        .doc-hex.h2 {
          top: 20%;
          right: -100px;
          width: 300px;
          height: 300px;
        }

        .doc-hex.h3 {
          bottom: -80px;
          left: 15%;
          width: 260px;
          height: 260px;
        }

        /* ================= WRAPPER ================= */

        .doc-wrapper {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .doc-header {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 30px;
          animation: doc-fadeUp 0.6s ease both;
        }

        @media (min-width: 640px) {
          .doc-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .doc-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .doc-logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #6366f1 100%
          );
          box-shadow: 0 10px 24px rgba(59,130,246,0.35);
        }

        .doc-logo svg {
          width: 26px;
          height: 26px;
        }

        .doc-title {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.02em;
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

        .doc-subtitle {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        /* ================= UPLOAD BUTTON ================= */

        .doc-upload-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 22px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #3b82f6,
            #6366f1
          );
          color: white;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 26px rgba(59,130,246,0.35);
          transition: 0.3s ease;
        }

        .doc-upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(99,102,241,0.45);
        }

        .doc-upload-btn svg {
          width: 17px;
          height: 17px;
        }

        /* ================= SEARCH AREA ================= */

        .doc-tools {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 28px;
          animation: doc-fadeUp 0.6s ease both;
        }

        @media (min-width: 640px) {
          .doc-tools {
            grid-template-columns: 1fr 210px;
          }
        }

        .doc-search,
        .doc-filter {
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
        }

        .doc-search svg,
        .doc-filter svg {
          width: 18px;
          height: 18px;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .doc-search input,
        .doc-filter select {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #0f172a;
          font-family: inherit;
          font-size: 13.5px;
        }

        .doc-search input::placeholder {
          color: #94a3b8;
        }

        .doc-filter select {
          cursor: pointer;
        }

        /* ================= SECTION ================= */

        .doc-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .doc-section-title {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 800;
        }

        .doc-section-title svg {
          width: 20px;
          height: 20px;
          color: #3b82f6;
        }

        .doc-count {
          padding: 6px 13px;
          border-radius: 999px;
          color: #1e40af;
          background: rgba(59,130,246,0.10);
          border: 1px solid rgba(59,130,246,0.20);
          font-size: 12px;
          font-weight: 700;
        }

        /* ================= EMPTY STATE ================= */

        .doc-empty {
          padding: 55px 25px;
          text-align: center;
          border-radius: 22px;
          border: 1px dashed rgba(100,116,139,0.25);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(14px);
          box-shadow: 0 15px 40px rgba(59,130,246,0.08);
          animation: doc-fadeUp 0.7s ease both;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 30px;
        }

        .document-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(59,130,246,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(59,130,246,0.14);
        }

        .document-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .document-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #2563eb;
          background: #eff6ff;
        }

        .document-icon svg {
          width: 23px;
          height: 23px;
        }

        .document-card h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }

        .document-card p {
          margin: 4px 0 2px;
          font-size: 12px;
          color: #2563eb;
          font-weight: 700;
        }

        .document-card span {
          font-size: 11px;
          color: #64748b;
        }

        /* ================= RIGHT SIDE (FIXED) ================= */

        .document-card-right {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .document-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doc-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border: 1px solid rgba(59,130,246,0.20);
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
          white-space: nowrap;
        }

        .doc-view-btn:hover {
          background: #dbeafe;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59,130,246,0.18);
        }

        .doc-view-btn svg {
          width: 15px;
          height: 15px;
        }

        .doc-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border: 1px solid rgba(16,185,129,0.20);
          border-radius: 10px;
          background: #ecfdf5;
          color: #059669;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
          white-space: nowrap;
        }

        .doc-download-btn:hover {
          background: #d1fae5;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16,185,129,0.18);
        }

        .doc-download-btn svg {
          width: 15px;
          height: 15px;
        }

        .doc-size-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.16);
          color: #1e40af;
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .doc-size-badge::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.20);
        }

        .doc-empty-icon {
          width: 82px;
          height: 82px;
          margin: 0 auto 18px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          color: #2563eb;
          background: linear-gradient(
            135deg,
            #e0edff,
            #eef4ff
          );
          box-shadow:
            inset 0 0 0 1px rgba(59,130,246,0.14),
            0 12px 28px rgba(59,130,246,0.18);
        }

        .doc-empty-icon svg {
          width: 42px;
          height: 42px;
        }

        .doc-empty-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .doc-empty-text {
          max-width: 430px;
          margin: 7px auto 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .doc-empty-btn {
          margin-top: 20px;
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

        .doc-empty-btn:hover {
          background: #eff6ff;
          transform: translateY(-1px);
        }

        /* ================= MODAL ================= */

        .doc-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(6px);
        }

        .doc-modal {
          width: 100%;
          max-width: 520px;
          border-radius: 24px;
          background: rgba(255,255,255,0.98);
          box-shadow: 0 30px 80px -20px rgba(59,130,246,0.45);
          overflow: hidden;
          animation: doc-fadeUp 0.35s ease both;
        }

        .doc-modal-top {
          height: 4px;
          background: linear-gradient(
            90deg,
            #3b82f6,
            #6366f1,
            #06b6d4
          );
        }

        .doc-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px 8px;
        }

        .doc-modal-header-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .doc-modal-icon {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(
            135deg,
            #3b82f6,
            #6366f1
          );
        }

        .doc-modal-icon svg {
          width: 21px;
          height: 21px;
        }

        .doc-modal-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
        }

        .doc-modal-subtitle {
          margin: 3px 0 0;
          font-size: 12.5px;
          color: #64748b;
        }

        .doc-close {
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

        .doc-close:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .doc-close svg {
          width: 17px;
          height: 17px;
        }

        .doc-form {
          padding: 18px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .doc-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .doc-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2563eb;
        }

        .doc-input,
        .doc-select {
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

        .doc-input:focus,
        .doc-select:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
        }

        .doc-file {
          width: 100%;
          padding: 12px;
          border: 1px dashed rgba(59,130,246,0.35);
          border-radius: 12px;
          background: #f8fbff;
          color: #475569;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .doc-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 5px;
        }

        .doc-cancel,
        .doc-save {
          padding: 11px 18px;
          border-radius: 11px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .doc-cancel {
          border: 1px solid rgba(148,163,184,0.35);
          background: white;
          color: #475569;
        }

        .doc-cancel:hover {
          background: #f8fafc;
        }

        .doc-save {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: none;
          background: linear-gradient(
            135deg,
            #3b82f6,
            #6366f1
          );
          color: white;
          box-shadow: 0 8px 20px rgba(59,130,246,0.28);
        }

        .doc-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 25px rgba(59,130,246,0.35);
        }

        .doc-save svg {
          width: 14px;
          height: 14px;
        }

        /* ================= ANIMATION ================= */

        @keyframes doc-fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 640px) {
          .doc-root {
            padding: 24px 14px 60px;
          }

          .doc-title {
            font-size: 24px;
          }

          .doc-logo {
            width: 46px;
            height: 46px;
          }

          .doc-header {
            margin-bottom: 25px;
          }

          .doc-upload-btn {
            width: 100%;
          }

          .doc-empty {
            padding: 45px 18px;
          }

          .doc-modal-header {
            padding-left: 18px;
            padding-right: 18px;
          }

          .doc-form {
            padding-left: 18px;
            padding-right: 18px;
          }

          /* Card stacks on mobile */
          .document-card {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
          }

          .document-card-right {
            justify-content: space-between;
            width: 100%;
            padding-top: 12px;
            border-top: 1px solid rgba(59,130,246,0.10);
          }

          .document-actions {
            flex: 1;
          }

          .doc-view-btn,
          .doc-download-btn {
            flex: 1;
            justify-content: center;
          }
        }
          .doc-delete-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 9px 14px;
            border: 1px solid rgba(239, 68, 68, 0.20);
            border-radius: 10px;
            background: #fef2f2;
            color: #dc2626;
            font-family: inherit;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.25s ease;
        }
          .doc-delete-btn:hover {
            background: #fee2e2;
            transform: translateY(-1px);
        }

          .doc-delete-btn svg {
            width: 15px;
            height: 15px;
        }
      `}</style>

      {/* ================= BACKGROUND ================= */}

      <div className="doc-bg" aria-hidden="true">
        <div className="doc-blob b1" />
        <div className="doc-blob b2" />
        <div className="doc-blob b3" />

        <div className="doc-hex h1" />
        <div className="doc-hex h2" />
        <div className="doc-hex h3" />
      </div>

      <div className="doc-wrapper">
        {/* ================= HEADER ================= */}

        <header className="doc-header">
          <div className="doc-header-left">
            <div className="doc-logo">{Icons.document}</div>

            <div>
              <h1 className="doc-title">Health Documents</h1>

              <p className="doc-subtitle">
                Store and manage your important health documents
              </p>
            </div>
          </div>

          <button
            className="doc-upload-btn"
            onClick={() => setShowUploadForm(true)}
          >
            {Icons.upload}
            Upload Document
          </button>
        </header>

        {/* ================= SEARCH / FILTER ================= */}

        <div className="doc-tools">
          <div className="doc-search">
            {Icons.search}

            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="doc-filter">
            {Icons.filter}

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="All">All Types</option>

              <option value="Lab Report">Lab Report</option>

              <option value="Medical Report">Medical Report</option>

              <option value="Prescription">Prescription</option>

              <option value="X-Ray / Scan">X-Ray / Scan</option>

              <option value="Health Certificate">Health Certificate</option>

              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* ================= SECTION HEADER ================= */}

        <div className="doc-section-head">
          <h2 className="doc-section-title">
            {Icons.document}
            My Documents
          </h2>

          <span className="doc-count">
            {documents.length}{" "}
            {documents.length === 1 ? "Document" : "Documents"}
          </span>
        </div>

        {/* ================= DOCUMENTS LIST ================= */}
        {documents.length > 0 && (
          <div className="documents-list">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="document-card-left">
                  <div className="document-icon">{Icons.document}</div>

                  <div>
                    <h3>{doc.title}</h3>
                    <p>{doc.type}</p>
                    <span>{doc.fileName}</span>
                  </div>
                </div>

                <div className="document-card-right">
                  <div className="document-actions">
                    <button
                      className="doc-view-btn"
                      onClick={() => handleViewDocument(doc)}
                    >
                      {Icons.eye}
                      View
                    </button>

                    <button
                      className="doc-download-btn"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      {Icons.download}
                      Download
                    </button>

                    <button
                      className="doc-delete-btn"
                      onClick={() => handleDeleteDocument(doc)}
                    >
                      {Icons.trash}
                      Delete
                    </button>
                  </div>

                  <span className="doc-size-badge">
                    {Math.round(doc.fileSize / 1024)} KB
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= UPLOAD MODAL ================= */}

        {showUploadForm && (
          <div className="doc-modal-overlay">
            <div className="doc-modal">
              <div className="doc-modal-top" />

              <div className="doc-modal-header">
                <div className="doc-modal-header-left">
                  <div className="doc-modal-icon">{Icons.document}</div>

                  <div>
                    <h2 className="doc-modal-title">Upload Document</h2>

                    <p className="doc-modal-subtitle">
                      Add a new health document
                    </p>
                  </div>
                </div>

                <button
                  className="doc-close"
                  onClick={() => setShowUploadForm(false)}
                  aria-label="Close"
                >
                  {Icons.close}
                </button>
              </div>

              <form className="doc-form" onSubmit={handleSubmit}>
                <div className="doc-field">
                  <label className="doc-label">Document Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="doc-input"
                    placeholder="e.g. Blood Test Report"
                    required
                  />
                </div>

                <div className="doc-field">
                  <label className="doc-label">Document Type</label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="doc-select"
                  >
                    <option value="Lab Report">Lab Report</option>

                    <option value="Medical Report">Medical Report</option>

                    <option value="Prescription">Prescription</option>

                    <option value="X-Ray / Scan">X-Ray / Scan</option>

                    <option value="Health Certificate">
                      Health Certificate
                    </option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="doc-field">
                  <label className="doc-label">Select File</label>

                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="doc-file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </div>

                <div className="doc-modal-actions">
                  <button
                    type="button"
                    className="doc-cancel"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="doc-save">
                    {Icons.upload}
                    Upload Document
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

export default Documents;
