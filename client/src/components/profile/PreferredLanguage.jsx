import { useState } from "react";

const PreferredLanguage = ({
  languages = [],
  setLanguages,
  theme,
  saveLanguages,
}) => {
  const [newLang, setNewLang] = useState("");

  const addLanguage = () => {
    if (!newLang.trim()) return;

    const lang = newLang.trim();

    if (languages.includes(lang)) {
      setNewLang("");
      return;
    }

    const updated = [...languages, lang];
    setLanguages(updated);
    saveLanguages(updated);
    setNewLang("");
  };

  const removeLanguage = (lang) => {
    const updated = languages.filter((l) => l !== lang);
    setLanguages(updated);
    saveLanguages(updated);
  };

  return (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "26px",
        background: "#fff",
        boxShadow: "0 16px 35px rgba(15, 23, 42, 0.07)",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center p-3 mb-3"
        style={{
          borderRadius: "22px",
          background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            <i className="bi bi-translate"></i>
          </div>

          <div>
            <h5 className="fw-bold text-white mb-1">
              Preferred Language / Medium
            </h5>
            <small className="text-white-50">
              Add languages you are comfortable with
            </small>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control border-0 shadow-sm"
          style={{
            borderRadius: "14px",
            padding: "11px 14px",
          }}
          placeholder="Example: English, Bengali, Hindi"
          value={newLang}
          onChange={(e) => setNewLang(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addLanguage();
          }}
        />

        <i
          className="bi bi-plus-circle-fill d-flex align-items-center"
          title="Add Language"
          onClick={addLanguage}
          style={{
            cursor: "pointer",
            fontSize: "34px",
            color: theme.primaryPurple,
          }}
        ></i>
      </div>

      {languages.length === 0 ? (
        <div
          className="text-center p-4 rounded-4"
          style={{
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i
            className="bi bi-chat-dots-fill"
            style={{ fontSize: "38px", color: theme.accentBlue }}
          ></i>
          <p className="text-muted mt-2 mb-0">No language added yet</p>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {languages.map((lang, i) => (
            <span
              key={i}
              className="d-flex align-items-center gap-2"
              style={{
                background: "#eef2ff",
                color: theme.primaryPurple,
                borderRadius: "999px",
                padding: "9px 13px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              <i className="bi bi-globe2"></i>
              {lang}

              <i
                className="bi bi-x-circle-fill"
                style={{ cursor: "pointer", fontSize: "14px" }}
                onClick={() => removeLanguage(lang)}
              ></i>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreferredLanguage;