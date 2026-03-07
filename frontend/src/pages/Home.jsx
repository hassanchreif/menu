import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDishes } from "../services/dishService";
import DishCard from "../components/DishCard";
import "../styles/Home.css";

export default function Home() {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      setError("");
      try {
        const dishes = await getAllDishes();
        setFeaturedDishes(dishes.slice(0, 3));
      } catch (err) {
        setError("Unable to load featured dishes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Restaurant</h1>
          <p>Discover our delicious menu</p>
          <Link to="/menu" className="hero-btn">
            View Menu
          </Link>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="featured-section">
        <h2>Featured Dishes</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading featured dishes...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : featuredDishes.length === 0 ? (
          <div className="empty-state">
            <p>No dishes available yet. Check back soon!</p>
            <Link to="/menu" className="view-all-btn">Browse Menu</Link>
          </div>
        ) : (
          <>
            <div className="featured-grid">
              {featuredDishes.map(dish => (
                <DishCard key={dish._id} dish={dish} isOwner={false} />
              ))}
            </div>
            <div className="featured-cta">
              <Link to="/menu" className="view-all-btn">View All Dishes</Link>
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Our Restaurant</h2>
        <p>
          We serve the finest cuisine with fresh ingredients and authentic recipes.
          Our chefs craft each dish with love and precision to bring you an
          unforgettable dining experience.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <p>📍 123 Restaurant Street, Food City</p>
          <p>📞 (123) 456-7890</p>
          <p>✉️ info@restaurant.com</p>
        </div>
      </section>
    </div>
  );
}
