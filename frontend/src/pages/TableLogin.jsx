import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { verifyTablePin } from "../services/tableService";
import "../styles/TableLogin.css";

export default function TableLogin() {
  const [tableNumber, setTableNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAsCustomer } = useAuth();
  const { setTableNumber: setCartTableNumber, setTablePin: setCartTablePin } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!tableNumber || !pin) {
      setError("Please enter both table number and PIN");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyTablePin(parseInt(tableNumber), pin);
      
      // Store customer info in auth context
      loginAsCustomer({
        tableNumber: parseInt(tableNumber),
        pin: pin,
        tableId: result.tableId
      });
      
      // Also update cart context
      setCartTableNumber(parseInt(tableNumber));
      setCartTablePin(pin);
      
      // Redirect to menu
      navigate("/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid table number or PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-login-container">
      <div className="table-login-card">
        <div className="table-login-header">
          <div className="table-login-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
          </div>
          <h2>Welcome, Customer!</h2>
          <p>Enter your table details to start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="table-login-form">
          <div className="form-group">
            <label htmlFor="tableNumber">Table Number</label>
            <input
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., 1"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin">Table PIN</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              inputMode="numeric"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        <div className="table-login-footer">
          <button onClick={() => navigate("/")} className="back-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

