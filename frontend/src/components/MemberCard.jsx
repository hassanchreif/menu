import React from "react";
import "../styles/MemberCard.css";

export default function MemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="member-card">
      <h3>{member.name}</h3>

      <div className="member-info">
        {member.email && <p><strong>Email:</strong> {member.email}</p>}
        {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
        <p><strong>Gender:</strong> {member.gender}</p>
        <p><strong>Subscription:</strong> {member.subscriptionType}</p>
        {member.subscriptionEnd && (
          <p>
            <strong>Ends:</strong>{" "}
            {new Date(member.subscriptionEnd).toLocaleDateString()}
          </p>
        )}
        <p><strong>Balance:</strong> ${member.balance}</p>
      </div>

      <div className="member-card-buttons">
        <button className="edit-btn" onClick={() => onEdit(member)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(member._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
