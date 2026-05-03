import EditableField from "../EditableField";

const ProfileCard = ({
  user,
  selectedImage,
  theme,
  fileInputRef,
  handleImageChange,
  updateField,
}) => {
  return (
    <div className="card border-0 p-4 text-center mb-4 shadow-sm"
      style={{ borderRadius: "20px", background: theme.cardBg }}>

      <div className="position-relative d-inline-block mx-auto mb-3">
        <img
          src={
            selectedImage
              ? selectedImage
              : user.profilePic
              ? `http://localhost:5000${user.profilePic}`
              : "https://via.placeholder.com/150"
          }
          className="rounded-circle p-1"
          style={{
            border: `3px solid ${theme.primaryPurple}`,
            objectFit: "cover",
          }}
          width="130"
          height="130"
        />

        <button
          className="btn btn-sm position-absolute shadow"
          style={{
            bottom: "5px",
            right: "5px",
            background: theme.primaryPurple,
            color: "#fff",
            borderRadius: "50%",
          }}
          onClick={() => fileInputRef.current.click()}
        >
          <i className="bi bi-camera-fill"></i>
        </button>

        <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden />
      </div>

      <EditableField value={user.name} field="name" onSave={updateField} />
      <EditableField value={user.email} field="email" onSave={updateField} />
      <EditableField value={user.phone} field="phone" onSave={updateField} />
    </div>
  );
};

export default ProfileCard;