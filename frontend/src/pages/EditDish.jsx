import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDishById, updateDish } from "../services/dishService";
import DishForm from "../components/DishForm";
import "../styles/EditDish.css";

export default function EditDish() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const data = await getDishById(id);
        setDish(data);
      } catch (error) {
        console.error("Error fetching dish:", error);
        alert("Dish not found");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id, navigate]);

  const handleSubmit = async (dishData) => {
    setSubmitting(true);
    try {
      await updateDish(id, dishData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating dish:", error);
      // Show the specific error message from the backend
      const errorMessage = error.response?.data?.message || "Failed to update dish";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="edit-dish-page"><p>Loading...</p></div>;
  }

  return (
    <div className="edit-dish-page">
      <h2>Edit Dish</h2>
      <DishForm
        dish={dish}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={submitting}
      />
    </div>
  );
}

