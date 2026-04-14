import { NavLink, useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isCartPage = location.pathname === "/cart";

  return (
    
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">GM</div>
        <div className="brand-copy">
          <p>GrocMart</p>
          <p>Fresh Grocery Delivery</p>
        </div>
      </div>
        
      <nav className="nav-links">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `nav-link${isActive ? " active" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `nav-link${isActive ? " active" : ""}`
          }
        >
          Cart
        </NavLink>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => navigate(isCartPage ? "/home" : "/cart")}
        >
          {isCartPage ? "Back to shop" : `Cart (${cartCount})`}
        </button>
        <button type="button" className="button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
