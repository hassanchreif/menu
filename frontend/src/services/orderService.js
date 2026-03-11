import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/orders`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new order (public - for customers)
export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

// Get all orders (owner only)
export const getAllOrders = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

// Get pending orders (owner only)
export const getPendingOrders = async () => {
  const response = await axios.get(`${API_URL}/pending`, { headers: getAuthHeader() });
  return response.data;
};

// Get recent orders (24-hour history) (owner only)
export const getRecentOrders = async () => {
  const response = await axios.get(`${API_URL}/history`, { headers: getAuthHeader() });
  return response.data;
};

// Get single order by ID (owner only)
export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};

// Terminate/complete an order (owner only)
export const terminateOrder = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/terminate`, {}, { headers: getAuthHeader() });
  return response.data;
};

