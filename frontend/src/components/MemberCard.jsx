import React from "react";
import axios from "axios";
import "../styles/MemberCard.css";

export default function MemberCard({
  member,
  token,
  onEdit,
  onDelete,
  onSubscriptionExtended,
}) {
  const isExpired =
    member.subscriptionEnd &&
    new Date(member.subscriptionEnd) < new Date();

  const handleExtend = async () => {
    const newType = prompt(
      "Enter new subscription type: daily, monthly, 6months, yearly"
    );
    if (!newType) return;

    try {
      await axios.put(
        `http://localhost:5000/api/members/${member._id}/extend`,
        { subscriptionType: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSubscriptionExtended();
    } catch (err) {
      console.error(err);
      alert("Failed to extend subscription");
    }
  };

  return (
    <div className={`member-card ${isExpired ? "expired" : ""}`}>
      
      {/* ✅ MEMBER IMAGE */}
      <div className="member-image-container">
        {member.image ? (
          <img
            src={`http://localhost:5000/${member.image}`}
            alt={member.name}
            className="member-image"
          />
        ) : (
          <div className="member-image-placeholder">
            No Image
          </div>
        )}
      </div>

      <h3>{member.name}</h3>

      <div className="member-info">
        {member.email && (
          <p>
            <strong>Email:</strong> {member.email}
          </p>
        )}

        {member.phone && (
          <p>
            <strong>Phone:</strong> {member.phone}
          </p>
        )}

        <p>
          <strong>Gender:</strong> {member.gender}
        </p>

        <p>
          <strong>Subscription:</strong> {member.subscriptionType}
        </p>

        {member.subscriptionEnd && (
          <p>
            <strong>Ends:</strong>{" "}
            {new Date(member.subscriptionEnd).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="member-card-buttons">
        <button
          className="edit-btn"
          onClick={() => onEdit(member)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(member._id)}
        >
          Delete
        </button>

        {isExpired && (
          <button
            className="extend-btn"
            onClick={handleExtend}
          >
            Extend
          </button>
        )}
      </div>
    </div>
  );
}