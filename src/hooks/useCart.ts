import { useState, useEffect, useRef } from "react";
import { get, post } from "../services/api";

export const useCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAdding, setIsAdding] = useState<number | null>(null);
  const pendingAddRef = useRef<Set<number>>(new Set());
  const userId = Number(localStorage.getItem("userId")) || NaN;

  const loadCartCount = async () => {
    try {
      if (!Number.isFinite(userId)) {
        setCartCount(0);
        return;
      }

    
      const cart = await get<any[]>(`Cart/${userId}`);

      const total = (cart || []).reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      setCartCount(total);
    } catch (error) {
      console.error("Failed to load cart", error);
      setCartCount(0);
    }
  };

  const addToCart = async (id: number) => {
    if (pendingAddRef.current.has(id)) return;

    if (!Number.isFinite(userId)) {
      throw new Error("User id is missing. Please log in again.");
    }

    if (!Number.isFinite(id)) {
      throw new Error("Invalid product id.");
    }

    pendingAddRef.current.add(id);
    setIsAdding(id);

    try {
      
      const response = await post<any>("Cart", {
        userId,
        productId: id,
        quantity: 1,
      });

      if (!response) {
        throw new Error("Failed to add item to cart.");
      }

      await loadCartCount();
      return response;

    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      pendingAddRef.current.delete(id);
      setIsAdding(null);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [userId]);

  return {
    cartCount,
    isAdding,
    addToCart,
    loadCartCount,
  };
};