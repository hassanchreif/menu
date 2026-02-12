import { useEffect, useState } from "react";
import axios from "axios";
import CreateMemberModal from "../components/CreateMemberModal";
import MemberCard from "../components/MemberCard";
import "../styles/Dashboard.css";

export default function Dashboard({ token }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch members
  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Search
  useEffect(() => {
    const filtered = members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [search, members]);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  // Payment
  const handlePay = async (member) => {
    const amount = prompt("Enter payment amount:");
    if (!amount) return;
    try {
      await axios.put(
        `http://localhost:5000/api/members/${member._id}`,
        {
          balance: member.balance + parseFloat(amount),
          subscriptionStart: new Date(),
          subscriptionEnd: calculateEndDate(member.subscriptionType),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateEndDate = (type) => {
    const now = new Date();
    switch (type) {
      case "daily":
        now.setDate(now.getDate() + 1);
        break;
      case "monthly":
        now.setMonth(now.getMonth() + 1);
        break;
      case "6months":
        now.setMonth(now.getMonth() + 6);
        break;
      case "yearly":
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        break;
    }
    return now;
  };

  // Stats
  const today = new Date();
  const activeMembers = members.filter(
    (m) => !m.subscriptionEnd || new Date(m.subscriptionEnd) > today
  ).length;
  const expiringSoon = members.filter((m) => {
    if (!m.subscriptionEnd) return false;
    const diffDays = (new Date(m.subscriptionEnd) - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays > 0;
  }).length;
  const totalRevenue = members.reduce((acc, m) => acc + (m.balance || 0), 0);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Members</h2>
        <button
          className="add-member-btn"
          onClick={() => {
            setEditingMember(null);
            setShowModal(true);
          }}
        >
          + Add Member
        </button>
      </div>

      {/* Stats */}
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search member by name..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Members List */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredMembers.length === 0 ? (
        <p className="empty-state">No members found.</p>
      ) : (
        <div className="members-list">
          {filteredMembers.map((m) => (
            <MemberCard
              key={m._id}
              member={m}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPay={handlePay}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateMemberModal
          token={token}
          onClose={() => {
            setShowModal(false);
            setEditingMember(null);
          }}
          onMemberCreated={fetchMembers}
          member={editingMember}
        />
      )}
    </div>
  );
}
