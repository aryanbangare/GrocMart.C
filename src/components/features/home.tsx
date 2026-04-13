import { useState } from "react";
import Navbar from "../layout/navbar";
import Sidebar from "../layout/sidebar";
import Hero from "./hero";
import ProductSection from "./ProductSection";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, setStatusMessage] = useState("");
  const [, setErrorMessage] = useState("");

  const { products, isLoading } = useProducts();
  const { cartCount, isAdding, addToCart } = useCart();

  const handleAddToCart = async (productId: number) => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      await addToCart(productId);
      setStatusMessage("Item added to cart successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add item to cart.");
    }
  };

  const categoryMap = new Map<string, number>();
  for (const product of products) {
    categoryMap.set(product.brand, (categoryMap.get(product.brand) ?? 0) + 1);
  }

  const categories = [
  { name: "All", count: products.length },
    ...Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })),
  ];


  const filteredProducts = products.filter((product) => {
    return selectedCategory === "All" || product.brand === selectedCategory;
  });

  return (
    <div className="page-shell">
      <div className="app-shell">
        <Navbar cartCount={cartCount} />
        <div className="dashboard-grid">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <main className="content-stack">
            <Hero
              totalProducts={products.length}
              activeCategory={selectedCategory}
              onBrowseProducts={() =>
                document.getElementById("products-section")?.scrollIntoView()
              }
            />

            <ProductSection
              products={filteredProducts}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              isAddingProduct={isAdding}
            />
            
          </main>
        </div>
      </div>
    </div>
  );
}
