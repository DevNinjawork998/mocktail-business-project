"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageColor: string;
  priceSubtext: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItem = { ...action.payload };
        const updatedItems = [...state.items, newItem];

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload,
      );

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider: React.FC<{
  children: React.ReactNode;
  initialState?: CartState;
}> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState || {
      items: [],
      total: 0,
      itemCount: 0,
    },
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate the parsed cart has the expected structure
        if (
          parsedCart &&
          typeof parsedCart === "object" &&
          Array.isArray(parsedCart.items)
        ) {
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        }
      } catch (error) {
        // Only log error in development, not in tests
        if (process.env.NODE_ENV === "development") {
          console.error("Error loading cart from localStorage:", error);
        }
        // Clear invalid localStorage data
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity: number }) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
