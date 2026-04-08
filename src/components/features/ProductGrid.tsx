import ProductCard from "../ui/productcard";
import type { Product } from "../../types/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (productId: number) => void;
  isAddingProduct: number | null;
}

export default function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  isAddingProduct,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading products...</h3>
        <p>Please wait while products load.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.productId}-${product.name}-${index}`}
          product={product}
          onAdd={onAddToCart}
          disabled={isAddingProduct === product.productId}
        />
      ))}
    </div>
  );
}
