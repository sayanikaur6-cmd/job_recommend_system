import { useRef, useState } from "react";

const templates = [
  {
    id: "peach",
    name: "White & Peach Modern",
    img: "/resume-templates/peach.jpg",
  },
  {
    id: "minimal",
    name: "Minimalist CV",
    img: "/resume-templates/minimal.jpg",
  },
  {
    id: "black",
    name: "Black Modern",
    img: "/resume-templates/black.jpg",
  },
];

const Resume = ({ user, theme, setUser }) => {
  const fileRef = useRef();
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);

  const downloadResume = async (templateId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/resume/generate/${templateId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Resume generate failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${user?.name || "resume"}-${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setShowTemplates(false);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UPLOAD
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload/resume", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      e.target.value = "";
    }
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete resume?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/users/delete/resume", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
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
              onClick={() => setShowTemplates(true)}
            >
              <i className="bi bi-file-earmark-text me-2"></i>
              Generate Resume
            </button>

            <i
              className="bi bi-upload text-white"
              style={{ cursor: "pointer", fontSize: "20px" }}
              title="Upload Resume"
              onClick={() => fileRef.current.click()}
            ></i>

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

        <input
          type="file"
          accept="application/pdf"
          ref={fileRef}
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>

      {showTemplates && (
        <div
          className="modal d-block"
          style={{ background: "#00000080" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content p-4" style={{ borderRadius: "18px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Choose Resume Template</h4>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTemplates(false)}
                ></button>
              </div>

              <div className="row g-4">
                {templates.map((temp) => (
                  <div className="col-md-4" key={temp.id}>
                    <div
                      className="card h-100 shadow-sm border-0"
                      style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        borderRadius: "16px",
                        overflow: "hidden",
                        opacity: loading ? 0.7 : 1,
                      }}
                      onClick={() => !loading && downloadResume(temp.id)}
                    >
                      <img
                        src={temp.img}
                        alt={temp.name}
                        className="card-img-top"
                        style={{
                          height: "420px",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />

                      <div className="card-body text-center">
                        <h6 className="fw-bold mb-2">{temp.name}</h6>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={loading}
                        >
                          {loading ? "Generating..." : "Use Template"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => setShowTemplates(false)}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resume;