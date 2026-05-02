import { useRef } from "react";

const Resume = ({ user, theme, setUser }) => {
  const fileRef = useRef();

  // 🔥 upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/upload/resume",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data); // 🔥 instantly update UI
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div
      className="card border-0 p-4 shadow-sm"
      style={{
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-white mb-0">My Resume</h5>

        <div className="d-flex gap-2">
          {/* 🔥 Upload Button */}
          <button
            className="btn btn-light fw-bold text-primary px-3"
            onClick={() => fileRef.current.click()}
          >
            Upload
          </button>

          {/* 🔥 View Button */}
          {user?.resume && (
            <a
              href={`http://localhost:5000${user.resume}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-light fw-bold text-primary px-4 shadow-sm"
            >
              View PDF
            </a>
          )}
        </div>
      </div>

      {/* 🔥 Hidden File Input */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileRef}
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Resume;