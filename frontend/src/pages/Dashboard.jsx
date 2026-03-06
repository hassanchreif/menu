import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllDishes, deleteDish } from "../services/dishService";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDishes = async () => {
    try {
      const data = await getAllDishes();
      setDishes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await deleteDish(id);
      fetchDishes();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-dish/${id}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/add-dish" className="add-dish-btn">
          + Add Dish
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Dishes</h3>
          <p className="stat-number">{dishes.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <Link to="/add-dish" className="action-btn">
          Add Dish
        </Link>
        <Link to="/menu" className="action-btn">
          Manage Menu
        </Link>
      </div>

      {/* Dishes Table */}
      <div className="dishes-table-container">
        <h3>All Dishes</h3>
        {loading ? (
          <p>Loading...</p>
        ) : dishes.length === 0 ? (
          <p className="empty-message">No dishes yet. Add your first dish!</p>
        ) : (
          <table className="dishes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish._id}>
                  <td>{dish.name}</td>
                  <td>{dish.category}</td>
                  <td>${dish.price}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(dish._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(dish._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

