import axios from "axios";

const API_URL = "http://localhost:5000/api/dishes";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllDishes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getDishById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createDish = async (dishData) => {
  const response = await axios.post(API_URL, dishData, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};

export const updateDish = async (id, dishData) => {
  const response = await axios.put(`${API_URL}/${id}`, dishData, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};

export const deleteDish = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};

