import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4e73df, #224abe)",
      }}
    >
      <div
        className="text-center p-4"
        style={{
          width: "380px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#fff",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Profile Image */}
        <img
          src={user.profilePic || "https://via.placeholder.com/120"}
          alt="profile"
          className="rounded-circle mb-3"
          width="120"
          height="120"
          style={{
            border: "4px solid #fff",
            objectFit: "cover",
          }}
        />

        {/* Name */}
        <h3 className="fw-bold">{user.name}</h3>

        {/* Email */}
        <p style={{ opacity: 0.8 }}>{user.email}</p>

        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Extra Info */}
        <div className="d-flex justify-content-around mt-3">
          <div>
            <h5>12</h5>
            <small>Applied</small>
          </div>
          <div>
            <h5>5</h5>
            <small>Saved</small>
          </div>
          <div>
            <h5>3</h5>
            <small>Interviews</small>
          </div>
        </div>

        {/* Button */}
        <button
          className="btn mt-4 w-100"
          style={{
            background: "#fff",
            color: "#224abe",
            borderRadius: "30px",
            fontWeight: "600",
          }}
        >
          Edit Profile ✏️
        </button>
      </div>
    </div>
  );
};

export default Profile;