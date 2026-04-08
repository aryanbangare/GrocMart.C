import { useState } from "react";
import ProductGrid from "./ProductGrid";

interface ProductSectionProps {
  products: any[];
  isLoading: boolean;
  onAddToCart: (productId: number) => void;
  isAddingProduct: number | null;
}

export default function ProductSection({
  products,
  isLoading,
  onAddToCart,
  isAddingProduct,
}: ProductSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchValue = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    return (
      searchValue === "" ||
      product.name.toLowerCase().includes(searchValue) ||
      product.brand.toLowerCase().includes(searchValue)
    );
  });

  return (
    <section className="panel section-panel" id="products-section">
      <div className="section-heading">
        <div>
          <h2>Products</h2>
          <p className="panel-subtitle">
            {filteredProducts.length} items found.
          </p>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
        </div>
      </div>

      <ProductGrid
        products={filteredProducts}
        isLoading={isLoading}
        onAddToCart={onAddToCart}
        isAddingProduct={isAddingProduct}
      />
    </section>
  );
}
