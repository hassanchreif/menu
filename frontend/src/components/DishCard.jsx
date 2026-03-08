import "../styles/DishCard.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function DishCard({ dish, isOwner, onEdit, onDelete }) {
  // Construct full image URL - handle both relative and absolute URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Prepend API URL for relative paths like /uploads/members/filename.jpg
    return `${API_URL}${imagePath}`;
  };

  return (
    <div className="dish-card">
      <div className="dish-image-container">
        <img src={getImageUrl(dish.image)} alt={dish.name} className="dish-image" />
        <span className="dish-category">{dish.category}</span>
      </div>
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-description">{dish.description}</p>
        <div className="dish-footer">
          <span className="dish-price">${dish.price.toFixed(2)}</span>
          {isOwner && (
            <div className="dish-actions">
              <button className="edit-btn" onClick={() => onEdit(dish)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(dish._id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
