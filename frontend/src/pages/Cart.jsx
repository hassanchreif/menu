import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import "../styles/Cart.css";

export default function Cart() {
  const { cart, tableNumber, setTableNumber, tablePin, setTablePin, cartTotal, updateQuantity, removeFromCart, clearCart, clearPin } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pinError, setPinError] = useState("");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user || user.role !== "customer") {
      navigate("/");
    }
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!tablePin || tablePin.length !== 4) {
      setPinError("Please enter the 4-digit table PIN");
      return;
    }

    setLoading(true);
    setError("");
    setPinError("");

    try {
      const orderData = {
        items: cart,
        tableNumber: user.tableNumber,
        totalAmount: cartTotal,
        pin: tablePin,
      };

      await createOrder(orderData);
      alert("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to place order. Please try again.";
      if (errorMessage.includes("PIN")) {
        setPinError(errorMessage);
      } else {
        setError(errorMessage);
      }
      console.error("Error placing order:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>Review your order before placing</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <p>Your cart is empty</p>
          <Link to="/menu" className="browse-menu-btn">Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <h2>Order Items</h2>
            {cart.map((item) => (
              <div key={item.dishId} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span className="cart-item-price">${item.price.toFixed(2)} each</span>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="quantity-btn decrease" 
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn increase" 
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-item-btn" 
                  onClick={() => removeFromCart(item.dishId)}
                  title="Remove item"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="table-selection">
              <span className="table-info">Table {user?.tableNumber}</span>
            </div>

            <div className="table-pin-section">
              <label htmlFor="table-pin">Table PIN</label>
              <input
                type="password"
                id="table-pin"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={tablePin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setTablePin(val);
                  setPinError("");
                }}
                className={pinError ? "error" : ""}
              />
              {pinError && <span className="pin-error">{pinError}</span>}
              <span className="pin-hint">Ask your server for the table PIN</span>
            </div>

            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${cartTotal.toFixed(2)}</span>
            </div>

            <button 
              className="place-order-btn" 
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

