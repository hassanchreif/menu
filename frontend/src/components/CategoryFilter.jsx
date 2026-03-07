import "../styles/CategoryFilter.css";

const DEFAULT_CATEGORIES = ["All", "Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function CategoryFilter({ value, onChange, categories = DEFAULT_CATEGORIES }) {
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-btn ${value === cat ? "active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
