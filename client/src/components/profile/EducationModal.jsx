import { useState, useEffect } from "react";

const EducationModal = ({ setShowModal, education, setEducation, editData }) => {
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        degree: editData.degree,
        institution: editData.institution,
        year: editData.year,
      });
    }
  }, [editData]);

  const handleSave = () => {
    if (!form.degree || !form.institution || !form.year) return;

    if (editData) {
      // ✏️ update
      const updated = [...education];
      updated[editData.index] = form;
      setEducation(updated);
    } else {
      // ➕ add
      setEducation([...education, form]);
    }

    setShowModal(false);
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>{editData ? "Edit Education" : "Add Education"}</h5>

          <input
            type="text"
            placeholder="Degree"
            className="form-control my-2"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />

          <input
            type="text"
            placeholder="Institution"
            className="form-control my-2"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
          />

          <input
            type="text"
            placeholder="Year"
            className="form-control my-2"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationModal;