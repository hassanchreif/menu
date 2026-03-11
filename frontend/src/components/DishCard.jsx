import "../styles/DishCard.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

export default function DishCard({ dish, isOwner, onEdit, onDelete, onToggleAvailability }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const isAvailable = dish.isAvailable !== false;

  return (
    <div className={`dish-card ${!isAvailable ? "unavailable" : ""}`}>
      <div className="dish-image-container">
        <img src={getImageUrl(dish.image)} alt={dish.name} className="dish-image" />
        <span className="dish-category">{dish.category}</span>
        {!isAvailable && (
          <div className="unavailable-overlay">
            <span className="unavailable-text">Out of Order</span>
          </div>
        )}
      </div>
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-description">{dish.description}</p>
        <div className="dish-footer">
          <span className="dish-price">${dish.price.toFixed(2)}</span>
          {isCustomer && isAvailable && (
            <button className="add-to-cart-btn" onClick={() => addToCart(dish)} title="Add to cart">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Add</span>
            </button>
          )}
          {isOwner && (
            <div className="dish-actions">
              <button 
                className={`toggle-btn ${isAvailable ? "disable" : "enable"}`}
                onClick={() => onToggleAvailability(dish._id)}
                title={isAvailable ? "Mark as unavailable" : "Mark as available"}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isAvailable ? 
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.44-3.13 2.44-5.25 0-3.87-3.13-7-7-7-3.87 0-7 3.13-7 7 0 2.12.93 3.99 2.44 5.25l2.92-2.92C12.13 13.26 12 12.65 12 12V7z"/> :
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  }
                </svg>
                <span>{isAvailable ? "Disable" : "Enable"}</span>
              </button>
              <button className="edit-btn" onClick={() => onEdit(dish)}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>Edit</span>
              </button>
              <button className="delete-btn" onClick={() => onDelete(dish._id)}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
