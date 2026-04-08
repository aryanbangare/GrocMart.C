import type { Product } from "../../types/types";


interface ProductCardProps {
  product: Product;
  onAdd: (id: number) => void;
  disabled?: boolean;
}

export default function ProductCard({
  product,
  onAdd,
  disabled = false,
}: ProductCardProps) {
  const hasDiscount = product.discountPrice < product.price;
  const isOutOfStock = product.availableQuantity === 0;

  return (
    <article className="product-card">
      <span className="product-badge">{product.brand}</span>

      <div>
        <h3>{product.name}</h3>
        <p className="product-meta">Brand: {product.brand}</p>
      </div>

      <div className="price-row">
        <span className="price-now">Rs. {product.discountPrice.toFixed(2)}</span>
        {hasDiscount ? (
          <span className="price-before">Rs. {product.price.toFixed(2)}</span>
        ) : null}
      </div>

      <button
        type="button"
        className="button-primary"
        onClick={() => onAdd(product.productId)}
        disabled={disabled || isOutOfStock}
      >
        {isOutOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </article>
  );
}
