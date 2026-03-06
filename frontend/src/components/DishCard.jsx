import "../styles/DishCard.css";

export default function DishCard({ dish, isOwner, onEdit, onDelete }) {
  return (
    <div className="dish-card">
      <div className="dish-image-container">
        <img src={dish.image} alt={dish.name} className="dish-image" />
        <span className="dish-category">{dish.category}</span>
      </div>
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-description">{dish.description}</p>
        <div className="dish-footer">
          <span className="dish-price">${dish.price}</span>
          {isOwner && (
            <div className="dish-actions">
              <button className="edit-btn" onClick={() => onEdit(dish)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => onDelete(dish._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

