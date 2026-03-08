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
        // Set initial image preview from existing image
        if (data.image) {
          // Check if it's a full URL or a relative path
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
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", dish.name);
      formData.append("category", dish.category);
      formData.append("price", dish.price);
      formData.append("description", dish.description);
      
      // If a new file was selected, append it; otherwise keep the existing image
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
        
        <label>Image</label>
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
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button type="submit" disabled={loading} className="submit-btn">{loading ? "Updating..." : "Update Dish"}</button>
        </div>
      </form>
    </div>
  );
}
