import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getAllDishes } from "../services/dishService";
import DishCard from "../components/DishCard";
import "../styles/Home.css";

export default function Home() {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchDishes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const dishes = await getAllDishes();
      // Filter out undefined/null dishes and limit to 8
      const validDishes = (dishes || []).slice(0, 8);
      setFeaturedDishes(validDishes);
    } catch (err) {
      setError("Unable to load featured dishes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  useEffect(() => {
    if (featuredDishes.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDishes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredDishes.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredDishes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredDishes.length) % featuredDishes.length);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + featuredDishes.length) % featuredDishes.length;
      const dish = featuredDishes[index];
      if (dish) {
        cards.push({ dish, position: i });
      }
    }
    return cards;
  };

  return (
    <div className="home">
      <section className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome to Our Restaurant</h2>
          <p>How would you like to proceed?</p>
          <div className="welcome-buttons">
            <Link to="/table-login" className="welcome-btn customer-btn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              </svg>
              <div className="welcome-btn-text">
                <span className="welcome-btn-title">I'm a Customer</span>
                <span className="welcome-btn-desc">Enter table PIN to order</span>
              </div>
            </Link>
            <Link to="/login" className="welcome-btn owner-btn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <div className="welcome-btn-text">
                <span className="welcome-btn-title">I'm the Owner</span>
                <span className="welcome-btn-desc">Manage your restaurant</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Premium Dining Experience</span>
          <h1>Welcome to <span>Our Restaurant</span></h1>
          <p>Discover the finest culinary experience with our carefully crafted dishes made from fresh, locally-sourced ingredients</p>
          <div className="hero-buttons">
            <Link to="/table-login" className="hero-btn">
              Order Now
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

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
          </div>
        ) : (
          <>
            <div className="carousel-container">
              <button className="carousel-btn carousel-prev" onClick={prevSlide}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              
              <div className="carousel-track-container">
                <div className="carousel-track">
                  {getVisibleCards().map((item, idx) => (
                    <div key={`carousel-${idx}`} className={`carousel-card-wrapper position-${item.position}`}>
                      <div className="carousel-card">
                        <DishCard dish={item.dish} isOwner={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="carousel-btn carousel-next" onClick={nextSlide}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
            </div>
            
            <div className="carousel-dots">
              {featuredDishes.map((_, index) => (
                <button key={index} className={`carousel-dot ${index === currentIndex ? 'active' : ''}`} onClick={() => goToSlide(index)} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="about-section">
        <h2>About Our Restaurant</h2>
        <p>We serve the finest cuisine with fresh ingredients and authentic recipes.</p>
        <div className="about-features">
          <div className="about-feature">
            <div className="about-feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
              </svg>
            </div>
            <h3>Fresh Ingredients</h3>
            <p>Locally sourced daily</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3>Quality Assurance</h3>
            <p>Best in class service</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Get In Touch</h2>
        <p className="contact-subtitle">We'd love to hear from you</p>
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-item-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="contact-item-text">
              <span>Location</span>
              <p>123 Restaurant Street</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <div className="contact-item-text">
              <span>Phone</span>
              <p>(123) 456-7890</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

