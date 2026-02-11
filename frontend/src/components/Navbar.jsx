import "../styles/Navbar.css";

export default function Navbar({ token, setToken }) {
  return (
    <nav className="navbar">
      <h1>🏋️ Gym Admin</h1>
      {token && <button onClick={() => setToken(null)}>Logout</button>}
    </nav>
  );
}
