import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [tableNumber, setTableNumber] = useState(1);
  const [tablePin, setTablePin] = useState("");

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total amount
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Add item to cart
  const addToCart = (dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.dishId === dish._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.dishId === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          dishId: dish._id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
        },
      ];
    });
  };

  // Remove item from cart
  const removeFromCart = (dishId) => {
    setCart((prevCart) => prevCart.filter((item) => item.dishId !== dishId));
  };

  // Update item quantity
  const updateQuantity = (dishId, quantity) => {
    if (quantity < 1) {
      removeFromCart(dishId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.dishId === dishId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = (keepTableInfo = false) => {
    setCart([]);
    if (!keepTableInfo) {
      setTableNumber(1);
      setTablePin("");
    }
  };

  // Clear PIN only (when table changes)
  const clearPin = () => {
    setTablePin("");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        tableNumber,
        setTableNumber,
        tablePin,
        setTablePin,
        cartItemCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearPin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

