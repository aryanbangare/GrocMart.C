import { useState, useEffect } from "react";
import { ApiService } from "../services";
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
        const data = await ApiService.getProducts();

        if (ignore) {
          return;
        }

        setProducts(data);
        setIsLoading(false);

        if (data.length === 0) {
          setErrorMessage("No products found.");
        }
      } catch (error) {
        if (!ignore) {
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
