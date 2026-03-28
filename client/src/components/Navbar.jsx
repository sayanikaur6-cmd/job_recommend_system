
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-auth">
        <button className="btn-login">Login</button>
        <button className="btn-register">Register</button>
      </div>

      <div className="nav-logo">
        <h1>Career<span>Sync</span></h1>
      </div>

      <div className="nav-empty"></div>
    </nav>
  );
}