import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllDishes, deleteDish, toggleAvailability } from "../services/dishService";
import "../styles/Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_URL}${imagePath}`;
};

export default function Dashboard() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDishes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllDishes();
      setDishes(data);
    } catch (err) {
      setError("Failed to load dishes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try { 
      await deleteDish(id); 
      fetchDishes(); 
    } catch (err) { 
      alert("Failed to delete dish"); 
    }
  };

  const handleToggleAvailability = async id => {
    try {
      await toggleAvailability(id);
      fetchDishes();
    } catch (err) {
      alert("Failed to update availability");
    }
  };

  const totalDishes = dishes.length;
  const categories = [...new Set(dishes.map(d => d.category))];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/add-dish" className="add-dish-btn">+ Add Dish</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Dishes</h3>
          <span className="stat-number">{totalDishes}</span>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <span className="stat-number">{categories.length}</span>
        </div>
      </div>

      <div className="dishes-table-container">
        <h3>All Dishes</h3>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dishes...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="empty-state">
            <p>No dishes yet. Add your first dish to get started!</p>
            <Link to="/add-dish" className="add-dish-btn">Add Dish</Link>
          </div>
        ) : (
          <table className="dishes-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map(d => {
                const isAvailable = d.isAvailable !== false;
                return (
                <tr key={d._id}>
                  <td>
                    <img src={getImageUrl(d.image)} alt={d.name} className="table-dish-image" />
                  </td>
                  <td>{d.name}</td>
                  <td><span className="category-badge">{d.category}</span></td>
                  <td>${d.price?.toFixed(2) || "0.00"}</td>
                  <td>
                    <span className={`status-badge ${isAvailable ? "available" : "unavailable"}`}>
                      {isAvailable ? "Available" : "Out of Order"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className={`toggle-btn ${isAvailable ? "disable" : "enable"}`}
                      onClick={() => handleToggleAvailability(d._id)}
                    >
                      {isAvailable ? "Disable" : "Enable"}
                    </button>
                    <button className="edit-btn" onClick={() => navigate(`/edit-dish/${d._id}`)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(d._id)}>Delete</button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
