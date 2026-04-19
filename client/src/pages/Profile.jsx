import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c51bf 0%, #6b46c1 50%, #2b6cb0 100%)",
        }}
      >
        <div
          className="spinner-border text-light"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521791136064-7986c2920216')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div
              className="text-center p-4"
              style={{
                borderRadius: "28px",
                background: "rgba(76,81,191,0.22)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
                color: "#fff",
                transition: "all 0.35s ease",
                animation: "fadeIn 0.8s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-6px) scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px) scale(1)")
              }
            >
              {/* Cover mini glow */}
              <div
                style={{
                  height: "90px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
                  marginBottom: "20px",
                }}
              ></div>

              {/* Profile Photo */}
              <img
                src={
                  user.profilePic
                    ? `http://localhost:5000/uploads/${user.profilePic}`
                    : "https://via.placeholder.com/140"
                }
                alt="profile"
                className="rounded-circle"
                width="140"
                height="140"
                style={{
                  border: "5px solid #fff",
                  objectFit: "cover",
                  marginTop: "-70px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                }}
              />

              {/* Name */}
              <h2 className="fw-bold mt-3">{user.name}</h2>

              {/* Email */}
              <p style={{ opacity: 0.85 }}>{user.email}</p>

              {/* Role */}
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: "25px",
                  background: "rgba(255,255,255,0.18)",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Frontend Developer
              </div>

              <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

              {/* Stats */}
              <div className="row text-center mt-4 mb-4">
                <div className="col-4">
                  <h4 className="fw-bold">12</h4>
                  <small>Applied</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold">5</h4>
                  <small>Saved</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold">3</h4>
                  <small>Interviews</small>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mb-4 text-start">
                <small>Profile Strength</small>
                <div
                  className="progress mt-2"
                  style={{
                    height: "10px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: "80%",
                      borderRadius: "20px",
                      background: "linear-gradient(90deg, #ffffff, #c3dafe)",
                    }}
                  ></div>
                </div>
                <small>80% completed</small>
              </div>

              {/* Buttons */}
              <button
                className="btn w-100 mb-3"
                style={{
                  background: "#fff",
                  color: "#4c51bf",
                  borderRadius: "30px",
                  fontWeight: "700",
                  padding: "12px",
                  fontSize: "16px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile ✏️
              </button>

              <button
                className="btn w-100"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: "30px",
                  fontWeight: "600",
                  padding: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                View Resume 📄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
