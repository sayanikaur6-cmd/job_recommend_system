import { useRef } from "react";
import { generateResume } from "../../utils/resumeApi";
const Resume = ({ user, theme, setUser }) => {
  const fileRef = useRef();

  // 🔥 UPLOAD
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
        setUser(data);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete resume?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/delete/resume",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data);
      } else {
        alert("Delete failed");
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

        <div className="d-flex gap-3 align-items-center">
          <button
            type="button"
            className="btn btn-light fw-semibold px-3 py-2"
            onClick={() => generateResume(user._id)}
          >
            <i className="bi bi-file-earmark-text me-2"></i>
            Generate Resume
          </button>
          {/* 🔥 UPLOAD ICON */}
          <i
            className="bi bi-upload text-white"
            style={{ cursor: "pointer", fontSize: "20px" }}
            title="Upload Resume"
            onClick={() => fileRef.current.click()}
          ></i>

          {/* 🔥 VIEW ICON */}
          {user?.resume && (
            <a
              href={`http://localhost:5000${user.resume}`}
              target="_blank"
              rel="noreferrer"
              title="View Resume"
            >
              <i
                className="bi bi-eye text-white"
                style={{ fontSize: "20px" }}
              ></i>
            </a>
          )}

          {/* 🔥 DELETE ICON */}
          {user?.resume && (
            <i
              className="bi bi-trash text-white"
              style={{ cursor: "pointer", fontSize: "20px" }}
              title="Delete Resume"
              onClick={handleDelete}
            ></i>
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