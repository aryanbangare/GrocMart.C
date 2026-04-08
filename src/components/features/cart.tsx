import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import { ApiService } from "../../services";
import type { CartItem } from "../../types/types";
import { getStoredUserId } from "../../utils/storage";

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);

  const userId = getStoredUserId();
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!Number.isFinite(userId)) {
      setErrorMessage("Log in again to view your cart.");
      setCart([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    const items = await ApiService.getCart(userId);
    setCart(items);
    setIsLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    async function fetchCart() {
      if (!Number.isFinite(userId)) {
        if (!ignore) {
          setErrorMessage("Log in again to view your cart.");
          setCart([]);
          setIsLoading(false);
        }
        return;
      }

      if (!ignore) {
        setIsLoading(true);
        setErrorMessage("");
      }

      const items = await ApiService.getCart(userId);

      if (!ignore) {
        setCart(items);
        setIsLoading(false);
      }
    }

    void fetchCart();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

  const checkout = async () => {
    if (!Number.isFinite(userId)) {
      setErrorMessage("Log in again to continue checkout.");
      return;
    }

    setStatusMessage("");
    setErrorMessage("");
    setIsCheckingOut(true);

    const response = await ApiService.checkout({
      userId,
      totalAmount: subtotal,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price ?? 0,
      })),
    });
    setIsCheckingOut(false);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    setStatusMessage("Order placed successfully. Your cart has been cleared.");
    setCart([]);
  };

  const changeQuantity = async (item: CartItem, nextQuantity: number) => {
    if (!Number.isFinite(userId)) {
      setErrorMessage("Log in again to update your cart.");
      return;
    }

    if (!Number.isFinite(item.productId)) {
      setErrorMessage("This cart item is missing a product id.");
      return;
    }

    setStatusMessage("");
    setErrorMessage("");
    setActiveCartId(item.cartId ?? item.productId);

    if (nextQuantity <= 0) {
      setCart(prevCart => 
        prevCart.filter(cartItem => 
          !(cartItem.cartId === item.cartId && cartItem.productId === item.productId)
        )
      );

      const removeResponse = await ApiService.removeFromCart(
        item.cartId,
        item.productId,
        userId,
      );
      setActiveCartId(null);
      if (!removeResponse.ok) {
        setErrorMessage(removeResponse.message);
        await loadCart(); 
        return;
      }
      setStatusMessage("Item removed from cart.");
      return;
    }
    const response = await ApiService.updateCart({
      cartId: item.cartId ?? 0,
      userId,
      productId: item.productId,
      quantity: nextQuantity,
    });
    setActiveCartId(null);
    if (!response.ok) {
      setErrorMessage(response.message);
      await loadCart(); 
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.cartId === item.cartId && cartItem.productId === item.productId
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      )
    );
    
    setStatusMessage("Cart updated successfully.");
  };
  const removeItem = async (item: CartItem) => {
    if (!Number.isFinite(userId)) {
      setErrorMessage("Log in again to update your cart.");
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    setActiveCartId(item.cartId ?? item.productId);
    const response = await ApiService.removeFromCart(
      item.cartId,
      item.productId,
      userId,
    );
    setActiveCartId(null);
    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }
    setStatusMessage("Item removed from cart.");
    await loadCart();
  };
  function isBusy(item: CartItem) {
    return activeCartId === (item.cartId ?? item.productId);
  }
  return (
    <div className="page-shell">
      <div className="app-shell cart-shell">
        <Navbar cartCount={totalItems} />
        <section className="panel section-panel">
          <div className="cart-header">
            <div>
              <h2>Your cart</h2>
              <p className="panel-subtitle">
                Review your groceries and finish checkout when you are ready.
              </p>
            </div>
            <div className="toolbar">
              <button
                type="button"
                className="button-ghost"
                onClick={() => navigate("/home")}
              >
                Continue shopping
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={checkout}
                disabled={isCheckingOut || cart.length === 0}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
          {statusMessage ? <div className="status-banner">{statusMessage}</div> : null}
          {errorMessage ? (
            <div className="status-banner error">{errorMessage}</div>
          ) : null}
        </section>
        <section className="panel section-panel">
          <div className="cart-summary">
            <div className="summary-card">
              <span>Total items</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="summary-card">
              <span>Subtotal</span>
              <strong>Rs. {subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-card">
              <span>Delivery</span>
              <strong>{cart.length > 0 ? "Free" : "Pending"}</strong>
            </div>
          </div>
        </section>
        <section className="panel section-panel">
          {isLoading ? (
            <div className="empty-state">
              <h3>Loading your cart...</h3>
              <p>Pulling the latest items from the checkout service.</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-state">
              <h3>Your cart is empty</h3>
              <p>Add a few products from the shop to see them here.</p>
            </div>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <article
                  key={`${item.cartId ?? "p"}-${item.productId}`}
                  className="cart-item"
                >
                  <div className="cart-item-info">
                    <h3>{item.productName || `Product #${item.productId}`}</h3>
                  </div>

                  <div className="cart-item-price">
                    <h3>Rs. {((item.price ?? 0) * item.quantity).toFixed(2)}</h3>
                    <p>Unit price: Rs. {(item.price ?? 0).toFixed(2)}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="button-ghost"
                        onClick={() => changeQuantity(item, item.quantity - 1)}
                        disabled={isBusy(item)}
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        type="button"
                        className="button-ghost"
                        onClick={() => changeQuantity(item, item.quantity + 1)}
                        disabled={isBusy(item)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="button-secondary remove-button"
                      onClick={() => removeItem(item)}
                      disabled={isBusy(item)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
