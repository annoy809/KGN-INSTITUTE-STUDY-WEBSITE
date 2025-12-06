import React, { useContext } from "react";
import { CartContext } from "../../../Cartcontext";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";
import './Cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id);
  };

const totalPrice = cartItems.reduce((acc, item) => {
  const price = Number(item.mainPrice || item.price || item.regularPrice || 0);
  return acc + price;
}, 0);

  const truncateDescription = (text, wordLimit = 25) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= wordLimit
      ? text
      : words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <>
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <p className="empty-cart-msg">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.img || item.featuredImage || "https://via.placeholder.com/80"}
                  alt={item.title}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>

                  <div className="cart-pricing">
                    <p className="main-price">₹{Number(item.mainPrice).toLocaleString('en-IN')}</p>

                    {item.regularPrice && item.regularPrice > item.price && (
                      <>
                        <p className="original-price">
                          <s>₹{Number(item.regularPrice).toLocaleString('en-IN')}</s>
                        </p>
                        <p className="discount">
                          You save ₹{(item.regularPrice - item.mainPrice).toLocaleString('en-IN')}
                        </p>
                      </>
                    )}
                  </div>

                  <p className="description">{truncateDescription(item.description)}</p>
                  <button onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="checkout-panel">
          <h3>Order Summary</h3>
         <div className="total-price">
  Total: ₹{Number(totalPrice).toLocaleString('en-IN')}
</div>
          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
