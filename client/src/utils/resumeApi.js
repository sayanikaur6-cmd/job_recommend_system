export const generateResume = async (user_id) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/resume/${user_id}`
  );

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
};