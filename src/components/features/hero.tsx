import heroImage from "../../assets/hero.png";
import { getStoredUserName } from "../../utils/storage";

interface HeroProps {
  totalProducts: number;
  activeCategory: string;
  onBrowseProducts: () => void;
}

export default function Hero({
  totalProducts,
}: HeroProps) {
  const shopperName = getStoredUserName();

  return (
    <section className="panel hero-panel">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Daily essentials</div>
          <p>
            Hello {shopperName}, find vegetables, fruits, snacks, and home
            essentials from one simple dashboard.
          </p>
          


          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{totalProducts}</strong>
               <div className="eyebrow">Item Available </div>
            </div>
            <div className="hero-stat">
              <strong>20 min</strong>
               <div className="eyebrow">Fast delivery</div>
            </div>
            <div className="hero-stat">
              <strong>7 days</strong>
              <div className="eyebrow">Fresh Stock</div>
            </div>
          </div>
        </div>
        
        <div className="hero-image-wrap">
          <img className="hero-image" src={heroImage} alt="Fresh groceries" />
        </div>
      </div>
    </section>
  );
}
