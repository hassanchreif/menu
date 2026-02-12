import { useState } from "react";
import axios from "axios";
import "../styles/PaymentModal.css";

export default function PaymentModal({ token, member, onClose, onPaymentSuccess }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/api/payments/${member._id}`,
        { amount: Number(amount), method, subscriptionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onPaymentSuccess(); // refresh members
      onClose(); // close modal
    } catch (err) {
      setError("Failed to add payment");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Make Payment for {member.name}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>

          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="6months">6 Months</option>
            <option value="yearly">Yearly</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="create-btn">Pay</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>

        {error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
}
