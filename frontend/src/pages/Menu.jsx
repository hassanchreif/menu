import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDishes, deleteDish } from "../services/dishService";
import { useAuth } from "../context/AuthContext";
import DishCard from "../components/DishCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import "../styles/Menu.css";

const CATEGORIES = ["All", "Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === "owner";

  const fetchDishes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllDishes();
      setDishes(data);
      setFilteredDishes(data);
    } catch (err) {
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  useEffect(() => {
    let filtered = dishes;
    if (search) filtered = filtered.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") filtered = filtered.filter(d => d.category === category);
    setFilteredDishes(filtered);
  }, [search, category, dishes]);

  const handleEdit = dish => navigate(`/edit-dish/${dish._id}`);
  
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try { 
      await deleteDish(id); 
      fetchDishes(); 
    } catch (err) { 
      alert("Failed to delete dish"); 
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our delicious selection of dishes</p>
      </div>
      
      <div className="menu-controls">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} categories={CATEGORIES} />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchDishes} className="retry-btn">Retry</button>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="empty-state">
          <p>No dishes found{search || category !== "All" ? " matching your criteria" : ""}.</p>
          {(search || category !== "All") && (
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="clear-btn">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="dish-count">{filteredDishes.length} dish{filteredDishes.length !== 1 ? "es" : ""} found</p>
          <div className="menu-grid">
            {filteredDishes.map(dish => (
              <DishCard key={dish._id} dish={dish} isOwner={isOwner} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
