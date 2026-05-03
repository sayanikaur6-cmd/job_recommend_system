const BASE_URL = import.meta.env.VITE_API_URL + "/api/experience";

// GET
export const getExperiences = async (user_id) => {
  const res = await fetch(`${BASE_URL}/${user_id}`);
  return res.json();
};

// ADD
export const addExperienceAPI = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// UPDATE
export const updateExperienceAPI = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// DELETE
export const deleteExperienceAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};