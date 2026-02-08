import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function App() {
  const [token, setToken] = useState("");

  return (
    <div>
      {!token && <Register />}
      {!token && <Login setToken={setToken} />}
      {token && <Dashboard token={token} />}
    </div>
  );
}

export default App;
