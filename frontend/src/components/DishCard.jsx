import "../styles/DishCard.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function DishCard({ dish, isOwner, onEdit, onDelete, onToggleAvailability }) {
  // Construct full image URL - handle both relative and absolute URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Prepend API URL for relative paths like /uploads/members/filename.jpg
    return `${API_URL}${imagePath}`;
  };

  // Check if dish is available (default to true if field doesn't exist)
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
          {isOwner && (
            <div className="dish-actions">
              <button 
                className={`toggle-btn ${isAvailable ? "disable" : "enable"}`}
                onClick={() => onToggleAvailability(dish._id)}
                title={isAvailable ? "Mark as unavailable" : "Mark as available"}
              >
                {isAvailable ? "Disable" : "Enable"}
              </button>
              <button className="edit-btn" onClick={() => onEdit(dish)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(dish._id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
