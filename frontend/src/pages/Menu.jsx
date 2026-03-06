import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDishes, deleteDish } from "../services/dishService";
import { useAuth } from "../context/AuthContext";
import DishCard from "../components/DishCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import "../styles/Menu.css";

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === "owner";

  const fetchDishes = async () => {
    try {
      const data = await getAllDishes();
      setDishes(data);
      setFilteredDishes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    let filtered = dishes;

    if (search) {
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((dish) => dish.category === category);
    }

    setFilteredDishes(filtered);
  }, [search, category, dishes]);

  const handleEdit = (dish) => {
    navigate(`/edit-dish/${dish._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await deleteDish(id);
      fetchDishes();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>

      <div className="menu-controls">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : filteredDishes.length === 0 ? (
        <p className="empty-message">No dishes found.</p>
      ) : (
        <div className="menu-grid">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish._id}
              dish={dish}
              isOwner={isOwner}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

