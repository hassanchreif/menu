import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDishById, updateDish } from "../services/dishService";
import "../styles/EditDish.css";
import "../styles/DishForm.css";

const CATEGORIES = ["Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function EditDish() {
  const { id } = useParams();
  const [dish, setDish] = useState({ name: "", category: "Pizza", price: "", description: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const data = await getDishById(id);
        setDish(data);
      } catch (err) { 
        setError("Failed to load dish");
      } finally {
        setFetching(false);
      }
    };
    fetchDish();
  }, [id]);

  const handleChange = e => setDish({ ...dish, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateDish(id, dish);
      navigate("/dashboard");
    } catch (err) { 
      setError(err.response?.data?.message || "Failed to update dish");
    }
    finally { setLoading(false); }
  };

  if (fetching) {
    return <div className="loading-screen"><div className="spinner"></div>Loading...</div>;
  }

  return (
    <div className="edit-dish-page">
      <h2>Edit Dish</h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit} className="dish-form">
        <label>Name</label>
        <input name="name" value={dish.name} onChange={handleChange} required placeholder="Enter dish name" />
        
        <label>Category</label>
        <select name="category" value={dish.category} onChange={handleChange}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        
        <label>Price</label>
        <input type="number" name="price" value={dish.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" />
        
        <label>Description</label>
        <textarea name="description" value={dish.description} onChange={handleChange} required placeholder="Describe the dish..." rows={4} />
        
        <label>Image URL</label>
        <input name="image" value={dish.image} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button type="submit" disabled={loading} className="submit-btn">{loading ? "Updating..." : "Update Dish"}</button>
        </div>
      </form>
    </div>
  );
}
