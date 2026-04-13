import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/navbar";
import { get, post, patch, del } from "../../../services/api";
import "./index.css";

type CartItem = {
  cartId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = Number(localStorage.getItem("userId")) || NaN;
  const navigate = useNavigate();


  const loadCart = async () => {
    try {
      const data = await get<any[]>(`Cart/${userId}`);

      const mapped = (data || []).map((i: any) => ({
        cartId: i.id,
        productId: i.productID, 
        productName: i.productName,
        price: i.price ?? 0,
        quantity: i.quantity ?? 0,
      }));

      setCart(mapped);
    } catch {
      setMessage(" Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadCart();
  }, [userId]);


  const updateQty = async (item: CartItem, qty: number) => {
    try {
      if (qty <= 0) {
        await del(`Cart/${item.cartId}`);
      } else {
        await patch(`Cart/${item.cartId}`, { quantity: qty });
      }

      await loadCart();
    } catch {
      setMessage(" Failed to update cart");
    }
  };


  const removeItem = async (item: CartItem) => {
    try {
      await del(`Cart/${item.cartId}`);
      await loadCart();
    } catch {
      setMessage(" Failed to remove item");
    }
  };


  const checkout = async () => {
    try {
      const payload = {
        userId,
        items: cart.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      console.log("CHECKOUT PAYLOAD:", payload);

      await post("OrderItems/checkout", payload);

      setMessage(" Order placed successfully");
      setCart([]);
    } catch (err) {
      console.error(err);
      setMessage(" Checkout failed");
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );



  return (
    <div className="page-shell">
      <Navbar cartCount={totalItems} />

      <div className="container">
        <h2>🛒 Your Cart ({totalItems})</h2>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : cart.length === 0 ? (
          <div>
            <p>Your cart is empty</p>
            <button onClick={() => navigate("/home")}>
              Go Shopping
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.cartId} className="cart-card">
                <div>
                  <h3>{item.productName}</h3>
                  <p>Rs. {item.price}</p>
                </div>

                <div>
                  <button onClick={() => updateQty(item, item.quantity - 1)}>
                    -
                  </button>

                  <span style={{ margin: "0 10px" }}>
                    {item.quantity}
                  </span>

                  <button onClick={() => updateQty(item, item.quantity + 1)}>
                    +
                  </button>
                </div>

                <div>
                  <strong>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>

                <button onClick={() => removeItem(item)}>
                   Remove
                </button>
              </div>
            ))}

            <hr />

            <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>

            <button onClick={checkout}>
               Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}