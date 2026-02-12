import { useState } from "react";
import axios from "axios";
import "../styles/CreateMemberModal.css";

export default function CreateMemberModal({ token, onClose, onMemberCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    subscriptionType: "monthly",
    balance: 0,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/members",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onMemberCreated(); // refresh dashboard
      onClose(); // close modal
    } catch (err) {
      setError("Failed to create member");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Add New Member</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
          />

          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            name="subscriptionType"
            value={form.subscriptionType}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="6months">6 Months</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="number"
            name="balance"
            placeholder="Balance"
            value={form.balance}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit" className="create-btn">
              Create
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>

        {error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
}
