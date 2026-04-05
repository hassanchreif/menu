
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllDishes, deleteDish, toggleAvailability } from "../services/dishService";
import { getAllTables, updateTablePin, resetTablePin, initializeTables } from "../services/tableService";
import "../styles/Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_URL}${imagePath}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const [dishes, setDishes] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dishes");
  const [editingTable, setEditingTable] = useState(null);
  const [newPin, setNewPin] = useState("");

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

  const fetchTables = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTables();
      setTables(data);
      // If no tables exist, initialize them
      if (data.length === 0) {
        await initializeTables();
        const newTables = await getAllTables();
        setTables(newTables);
      }
    } catch (err) {
      setError("Failed to load tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === "dishes") {
      fetchDishes();
    } else {
      fetchTables();
    }
  }, [activeTab]);

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

  const handleEditPin = (table) => {
    setEditingTable(table.tableNumber);
    setNewPin(table.pin || "");
  };

  const handleSavePin = async (tableNumber) => {
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      alert("Please enter a valid 4-digit PIN");
      return;
    }
    try {
      await updateTablePin(tableNumber, newPin);
      alert("PIN updated successfully!");
      setEditingTable(null);
      setNewPin("");
      fetchTables();
    } catch (err) {
      alert("Failed to update PIN");
    }
  };

  const handleResetPin = async (tableNumber) => {
    if (!window.confirm("Are you sure you want to reset this table's PIN?")) return;
    try {
      const result = await resetTablePin(tableNumber);
      alert(`PIN has been reset to: ${result.pin}`);
      fetchTables();
    } catch (err) {
      alert("Failed to reset PIN");
    }
  };

  const handleToggleTableAvailability = async (tableNumber, currentStatus) => {
    try {
      await updateTablePin(tableNumber, null, !currentStatus);
      alert(`Table ${tableNumber} is now ${!currentStatus ? "Available" : "Unavailable"}`);
      fetchTables();
    } catch (err) {
      alert("Failed to update table status");
    }
  };

  const handleCancelEdit = () => {
    setEditingTable(null);
    setNewPin("");
  };

  const totalDishes = dishes.length;
  const categories = [...new Set(dishes.map(d => d.category))];
  const activeTables = tables.filter(t => t.isActive).length;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div>
            <h2>Dashboard</h2>
            <p>Manage your restaurant</p>
          </div>
        </div>
        {activeTab === "dishes" && (
          <Link to="/add-dish" className="add-dish-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Dish
          </Link>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === "dishes" ? "active" : ""}`}
          onClick={() => setActiveTab("dishes")}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
          </svg>
          Menu Items
        </button>
        <button 
          className={`tab-btn ${activeTab === "tables" ? "active" : ""}`}
          onClick={() => setActiveTab("tables")}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Table Management
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {activeTab === "dishes" ? (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon dishes">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <h3>Total Dishes</h3>
                <span className="stat-number">{totalDishes}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon categories">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <h3>Categories</h3>
                <span className="stat-number">{categories.length}</span>
              </div>
            </div>
          </div>

          {/* Dishes Table */}
          <div className="dishes-table-container">
            <div className="dishes-table-header">
              <h3>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                All Dishes
              </h3>
              <span className="dish-count-badge">{totalDishes} dishes</span>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dishes...</p>
              </div>
            ) : dishes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                  </svg>
                </div>
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
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isAvailable ? 
                              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.44-3.13 2.44-5.25 0-3.87-3.13-7-7-7-3.87 0-7 3.13-7 7 0 2.12.93 3.99 2.44 5.25l2.92-2.92C12.13 13.26 12 12.65 12 12V7z"/> :
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            }
                          </svg>
                          <span>{isAvailable ? "Disable" : "Enable"}</span>
                        </button>
                        <button className="edit-btn" onClick={() => navigate(`/edit-dish/${d._id}`)}>
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(d._id)}>
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Tables Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon tables">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <h3>Total Tables</h3>
                <span className="stat-number">{tables.length}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon active-tables">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <h3>Active Tables</h3>
                <span className="stat-number">{activeTables}</span>
              </div>
            </div>
          </div>

          {/* Tables Info Banner */}
          <div className="tables-info-banner">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <div>
              <strong>Table PIN Management</strong>
              <p>Each table has a unique 4-digit PIN. Customers must enter this PIN to place orders. You can edit or reset PINs here.</p>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="tables-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading tables...</p>
              </div>
            ) : tables.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p>No tables found. Click Initialize to create tables.</p>
                <button className="add-dish-btn" onClick={async () => {
                  await initializeTables();
                  fetchTables();
                }}>Initialize Tables</button>
              </div>
            ) : (
              tables.map(table => (
                <div key={table._id} className={`table-card ${table.isActive ? "active" : "inactive"}`}>
                  <div className="table-card-header">
                    <span className="table-number">Table {table.tableNumber}</span>
                    <span className={`table-status ${table.isActive ? "active" : "inactive"}`}>
                      {table.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="table-card-body">
                    {editingTable === table.tableNumber ? (
                      <div className="table-pin-edit">
                        <label>New PIN:</label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="4 digits"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                        <div className="table-pin-edit-actions">
                          <button className="save-btn" onClick={() => handleSavePin(table.tableNumber)}>Save</button>
                          <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="table-pin-display">
                        <span className="pin-label">PIN:</span>
                        <span className="pin-value">{table.pin}</span>
                        <span className="pin-note">(Click edit to change)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="table-card-actions">
                    <button className={`toggle-table-btn ${table.isActive ? "deactivate" : "activate"}`} onClick={() => handleToggleTableAvailability(table.tableNumber, table.isActive)} title={table.isActive ? "Make Unavailable" : "Make Available"}>
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {table.isActive ? 
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.44-3.13 2.44-5.25 0-3.87-3.13-7-7-7-3.87 0-7 3.13-7 7 0 2.12.93 3.99 2.44 5.25l2.92-2.92C12.13 13.26 12 12.65 12 12V7z"/> :
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        }
                      </svg>
                    </button>
                    <button className="edit-pin-btn" onClick={() => handleEditPin(table)}>
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Edit PIN
                    </button>
                    <button className="reset-pin-btn" onClick={() => handleResetPin(table.tableNumber)}>
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

