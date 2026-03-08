import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDishById, updateDish } from "../services/dishService";
import "../styles/EditDish.css";
import "../styles/DishForm.css";

const CATEGORIES = ["Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function EditDish() {
  const { id } = useParams();
  const [dish, setDish] = useState({ name: "", category: "Pizza", price: "", description: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const data = await getDishById(id);
        setDish(data);
        if (data.image) {
          const imageUrl = data.image.startsWith("http") 
            ? data.image 
            : `${process.env.REACT_APP_API_URL}${data.image}`;
          setImagePreview(imageUrl);
        }
      } catch (err) { 
        setError("Failed to load dish");
      } finally {
        setFetching(false);
      }
    };
    fetchDish();
  }, [id]);

  const handleChange = e => setDish({ ...dish, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", dish.name);
      formData.append("category", dish.category);
      formData.append("price", dish.price);
      formData.append("description", dish.description);
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (dish.image) {
        formData.append("image", dish.image);
      }

      await updateDish(id, formData);
      navigate("/dashboard");
    } catch (err) { 
      setError(err.response?.data?.message || "Failed to update dish");
    }
    finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="edit-dish-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <span>Loading dish...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-dish-page">
      {/* Header */}
      <div className="form-header">
        <div className="form-header-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
        <h2>Edit Dish</h2>
        <p>Update your menu item details</p>
      </div>

      {error && (
        <div className="error-banner">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="dish-form">
        <div className="form-group">
          <label>Dish Name <span className="required">*</span></label>
          <input name="name" value={dish.name} onChange={handleChange} required placeholder="e.g., Margherita Pizza" />
        </div>
        
        <div className="form-group">
          <label>Category <span className="required">*</span></label>
          <select name="category" value={dish.category} onChange={handleChange}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label>Price <span className="required">*</span></label>
          <input type="number" name="price" value={dish.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" />
        </div>
        
        <div className="form-group">
          <label>Description <span className="required">*</span></label>
          <textarea name="description" value={dish.description} onChange={handleChange} required placeholder="Describe the dish, ingredients, taste..." rows={4} />
        </div>
        
        <div className="form-group">
          <label>Dish Image</label>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/webp" 
            onChange={handleImageChange} 
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <><span className="spinner"></span>Updating...</> : (
              <>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                Update Dish
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
