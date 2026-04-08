interface SidebarProps {
  categories: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: SidebarProps) {
  return (
    <aside className="panel sidebar">
      <div className="sidebar-head">
        <h3>Categories</h3>
        <p>Select a category to filter products.</p>
      </div>

      <ul className="category-list" role="list">
        {categories.map((category) => (
          <li key={category.name} className="category-item">
            <button
              type="button"
              className={`category-button${
                selectedCategory === category.name ? " active" : ""
              }`}
              onClick={() => onSelectCategory(category.name)}
              aria-pressed={selectedCategory === category.name}
              aria-label={`Filter by ${category.name}, ${category.count} items`}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count" aria-label={`${category.count} items available`}>
                {category.count} items
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
  