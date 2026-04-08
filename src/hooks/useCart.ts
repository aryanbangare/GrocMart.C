import { useState, useEffect, useRef } from "react";
import { ApiService } from "../services";
import { getStoredUserId } from "../utils/storage";

export const useCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAdding, setIsAdding] = useState<number | null>(null);
  const pendingAddRef = useRef<Set<number>>(new Set());
  const userId = getStoredUserId();

  const loadCartCount = async () => {
    if (!Number.isFinite(userId)) {
      setCartCount(0);
      return;
    }

    const cart = await ApiService.getCart(userId);
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const addToCart = async (productId: number) => {
    if (pendingAddRef.current.has(productId)) {
      return;
    }

    if (!Number.isFinite(userId)) {
      throw new Error("User id is missing. Please log in again before adding items to cart.");
    }

    if (!Number.isFinite(productId)) {
      throw new Error("This product is missing a valid product id.");
    }

    pendingAddRef.current.add(productId);
    setIsAdding(productId);

    try {
      const response = await ApiService.addToCart({
        userId,
        productId,
        quantity: 1,
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      await loadCartCount();
      return response;
    } finally {
      pendingAddRef.current.delete(productId);
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
