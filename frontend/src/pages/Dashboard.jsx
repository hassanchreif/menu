import { useEffect, useState } from "react";
import axios from "axios";
import CreateMemberModal from "../components/CreateMemberModal";
import "../styles/Dashboard.css";

export default function Dashboard({ token }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // ========================
  // Fetch Members
  // ========================
  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/members",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMembers(res.data);
      setFilteredMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  // ========================
  // Search
  // ========================
  useEffect(() => {
    const filtered = members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [search, members]);

  // ========================
  // Delete
  // ========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/members/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // ========================
  // Statistics
  // ========================
  const today = new Date();

  const activeMembers = members.filter(
    (m) => !m.subscriptionEnd || new Date(m.subscriptionEnd) > today
  ).length;

  const expiringSoon = members.filter((m) => {
    if (!m.subscriptionEnd) return false;
    const end = new Date(m.subscriptionEnd);
    const diffDays = (end - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays > 0;
  }).length;

  const totalRevenue = members.reduce(
    (acc, m) => acc + (m.balance || 0),
    0
  );

  return (
    <div className="dashboard">
      {/* ================= Header ================= */}
      <div className="dashboard-header">
        <h2>Members</h2>
        <button
          className="add-member-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Member
        </button>
      </div>

      {/* ================= Stats ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active</h3>
          <p>{activeMembers}</p>
        </div>
        <div className="stat-card">
          <h3>Expiring Soon</h3>
          <p>{expiringSoon}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue}</p>
        </div>
      </div>

      {/* ================= Search ================= */}
      <input
        type="text"
        placeholder="Search member by name..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= Members List ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredMembers.length === 0 ? (
        <p className="empty-state">No members found.</p>
      ) : (
        <div className="members-list">
          {filteredMembers.map((m) => (
            <div key={m._id} className="member-card">
              <h3>{m.name}</h3>

              <div className="member-info">
                {m.email && (
                  <p><strong>Email:</strong> {m.email}</p>
                )}
                {m.phone && (
                  <p><strong>Phone:</strong> {m.phone}</p>
                )}
                <p><strong>Gender:</strong> {m.gender}</p>
                <p><strong>Subscription:</strong> {m.subscriptionType}</p>

                {m.subscriptionEnd && (
                  <p>
                    <strong>Ends:</strong>{" "}
                    {new Date(m.subscriptionEnd).toLocaleDateString()}
                  </p>
                )}

                <p><strong>Balance:</strong> ${m.balance}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(m._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= Modal ================= */}
      {showModal && (
        <CreateMemberModal
          token={token}
          onClose={() => setShowModal(false)}
          onMemberCreated={fetchMembers}
        />
      )}
    </div>
  );
}
