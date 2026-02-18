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

  // Search members
  useEffect(() => {
    const filtered = members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [search, members]);

  // Delete member
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

  // Edit member
  const handleEdit = (member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  // Extend subscription (called from MemberCard)
  const handleExtend = async (memberId, newType) => {
    try {
      await axios.put(
        `http://localhost:5000/api/members/${memberId}/extend`,
        { subscriptionType: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to extend subscription");
    }
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
              token={token}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSubscriptionExtended={() => fetchMembers()}
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
