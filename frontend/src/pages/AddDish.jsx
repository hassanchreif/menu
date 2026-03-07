import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDish } from "../services/dishService";
import DishForm from "../components/DishForm";
import "../styles/AddDish.css";

export default function AddDish() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (dishData) => {
    setLoading(true);
    try {
      await createDish(dishData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating dish:", error);
      // Show the specific error message from the backend
      const errorMessage = error.response?.data?.message || "Failed to create dish";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="add-dish-page">
      <h2>Add New Dish</h2>
      <DishForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
}

