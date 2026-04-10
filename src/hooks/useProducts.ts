import { useState, useEffect } from "react";
import { get } from "../services/api"; // ✅ import your get function
import type { Product } from "../types/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
      
        const data = await get<Product[]>("Products");

        if (ignore) return;

        
        const productList = data || [];

        setProducts(productList);
        setIsLoading(false);

        if (productList.length === 0) {
          setErrorMessage("No products found.");
        }

      } catch (error) {
        if (!ignore) {
          console.error("Failed to load products:", error);
          setErrorMessage("Failed to load products.");
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    products,
    isLoading,
    errorMessage,
  };
};