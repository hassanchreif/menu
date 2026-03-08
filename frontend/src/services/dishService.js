import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/dishes`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllDishes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getDishById = async id => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createDish = async dishData => {
  // Check if dishData contains a file (for image upload)
  const hasFile = dishData instanceof FormData || dishData.image instanceof File;
  
  let config = {
    headers: {
      ...getAuthHeader(),
      "Content-Type": dishData instanceof FormData ? "multipart/form-data" : "application/json",
    },
  };

  const response = await axios.post(API_URL, dishData, config);
  return response.data;
};

export const updateDish = async (id, dishData) => {
  // Check if dishData contains a file (for image upload)
  const hasFile = dishData instanceof FormData || (dishData.image && dishData.image instanceof File);
  
  let config = {
    headers: {
      ...getAuthHeader(),
      "Content-Type": dishData instanceof FormData ? "multipart/form-data" : "application/json",
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, dishData, config);
  return response.data;
};

export const deleteDish = async id => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const toggleAvailability = async id => {
  const response = await axios.patch(`${API_URL}/${id}/availability`, {}, { headers: getAuthHeader() });
  return response.data;
};
