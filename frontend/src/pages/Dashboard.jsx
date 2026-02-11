import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

export default function Dashboard({ token }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="dashboard">
      <h2>Members</h2>
      <div className="members-list">
        {members.map((m) => (
          <div key={m._id} className="member-card">
            <strong>{m.name}</strong>
            <p>{m.subscriptionType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
