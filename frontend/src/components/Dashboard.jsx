import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/members", {
          headers: { Authorization: "Bearer " + token },
        });
        setMembers(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    if (token) fetchMembers();
  }, [token]);

  return (
    <div>
      <h2>Members</h2>
      <ul>
        {members.map((m) => (
          <li key={m._id}>
            {m.name} - {m.email || m.phone} - {m.subscriptionType}
          </li>
        ))}
      </ul>
    </div>
  );
}
