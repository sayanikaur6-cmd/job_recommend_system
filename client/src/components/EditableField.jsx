import { useState, useRef, useEffect } from "react";

const EditableField = ({
  value,
  field,
  type = "text",
  placeholder = "",
  onSave,
  inputClass = "",
  textClass = "",
  style = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isEditing && inputRef.current && !inputRef.current.contains(e.target)) {
        handleSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, localValue]);

  const handleSave = async () => {
    setIsEditing(false);
    if (localValue !== value) {
      setLoading(true);
      await onSave(field, localValue);
      setLoading(false);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type={type}
      className={`form-control ${inputClass}`}
      value={localValue}
      placeholder={placeholder}
      autoFocus
      onChange={(e) => setLocalValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setIsEditing(false);
      }}
    />
  ) : (
    <div className={`d-flex align-items-center gap-2 ${textClass}`} style={style}>
      <span>{value || placeholder}</span>

      {loading ? (
        <span className="spinner-border spinner-border-sm"></span>
      ) : (
        <i
          className="bi bi-pencil-square"
          style={{ cursor: "pointer" }}
          onClick={() => setIsEditing(true)}
        ></i>
      )}
    </div>
  );
};

export default EditableField;