import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = token => {
    localStorage.setItem("token", token);
    // Assuming token contains user info
    const decoded = { role: "owner" }; 
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const loginAsCustomer = (customerInfo) => {
    const customerUser = { 
      role: "customer",
      tableNumber: customerInfo.tableNumber,
      pin: customerInfo.pin,
      tableId: customerInfo.tableId
    };
    setUser(customerUser);
    localStorage.setItem("user", JSON.stringify(customerUser));
  };

  const logout = (clearCartFn = null) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Clear cart when logging out (unless it's a customer leaving table)
    if (clearCartFn) {
      clearCartFn();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsCustomer, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
