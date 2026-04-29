const PersonalDetails = ({ editedUser, setEditedUser, theme, updateField, user }) => {
    return (
        <div
            className="card border-0 p-4 mb-4 shadow-sm"
            style={{ borderRadius: "20px", background: theme.cardBg }}
        >
            <h6
                className="fw-bold mb-3"
                style={{ color: theme.primaryPurple }}
            >
                Personal Details
            </h6>
            <div className="mb-3">
                <label className="small fw-bold text-muted">Location</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                        <i
                            className="bi bi-geo-alt-fill"
                            style={{ color: theme.accentBlue }}
                        ></i>
                    </span>
                    <input
                        type="text"
                        className="form-control bg-light border-0"
                        value={editedUser.location}
                        onChange={(e) =>
                            setEditedUser({ ...editedUser, location: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="mb-3">
                <label className="small fw-bold text-muted">
                    Date of Birth
                </label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                        <i
                            className="bi bi-calendar3"
                            style={{ color: theme.accentBlue }}
                        ></i>
                    </span>

                    <input
                        type="date"
                        className="form-control bg-light border-0"
                        value={user.dob || ""}
                        max={new Date().toISOString().split("T")[0]} // future date block
                        onChange={async (e) => {
                            const newDob = e.target.value;

                            // UI instant update
                            setUser((prev) => ({ ...prev, dob: newDob }));

                            // backend update
                            await updateField("dob", newDob);
                        }}
                    />
                </div>
            </div>

            <h6
                className="fw-bold mt-4 mb-3"
                style={{ color: theme.primaryPurple }}
            >
                Social Links
            </h6>
            <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0">
                    <i
                        className="bi bi-linkedin"
                        style={{ color: "#0077b5" }}
                    ></i>
                </span>
                <input
                    type="url"
                    className="form-control bg-light border-0"
                    placeholder="LinkedIn"
                    value={editedUser.linkedin}
                    onChange={(e) =>
                        setEditedUser({ ...editedUser, linkedin: e.target.value })
                    }
                />
            </div>
            <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0">
                    <i className="bi bi-github" style={{ color: "#333" }}></i>
                </span>
                <input
                    type="url"
                    className="form-control bg-light border-0"
                    placeholder="GitHub"
                    value={editedUser.github}
                    onChange={(e) =>
                        setEditedUser({ ...editedUser, github: e.target.value })
                    }
                />
            </div>
        </div>
    );
};

export default PersonalDetails;