import "../styles/CategoryFilter.css";

const categories = ["All", "Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${value === category ? "active" : ""}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

