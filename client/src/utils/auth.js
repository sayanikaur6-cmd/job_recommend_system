export const handleGoogleRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    // clean URL
    window.history.replaceState({}, document.title, "/");

    return true; // login success
  }

  return false;
};