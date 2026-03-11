import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/tables`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Verify table PIN (public - for customers)
export const verifyTablePin = async (tableNumber, pin) => {
  const response = await axios.post(`${API_URL}/verify-pin`, { tableNumber, pin });
  return response.data;
};

// Initialize tables (public)
export const initializeTables = async () => {
  const response = await axios.post(`${API_URL}/initialize`);
  return response.data;
};

// Get all tables (owner only)
export const getAllTables = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

// Update table PIN (owner only)
export const updateTablePin = async (tableNumber, pin, isActive) => {
  const response = await axios.put(`${API_URL}/${tableNumber}/pin`, { pin, isActive }, { headers: getAuthHeader() });
  return response.data;
};

// Reset table PIN (owner only)
export const resetTablePin = async (tableNumber) => {
  const response = await axios.post(`${API_URL}/${tableNumber}/reset-pin`, {}, { headers: getAuthHeader() });
  return response.data;
};

