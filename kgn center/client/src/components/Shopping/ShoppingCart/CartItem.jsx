import React from "react";

const CartItem = ({ item, onRemove, onSave, onMoveToCart, isSaved }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="item-image" />
      <div className="item-details">
        <h4 className="item-title">{item.title}</h4>
        <p className="item-author">by {item.author}</p>
        <div className="item-meta">
          <span className="best-seller">Bestseller</span>
          <span className="premium">Premium</span>
        </div>
        <div className="item-actions">
          {!isSaved ? (
            <>
              <button onClick={() => onRemove(item.id)}>Remove</button>
              <button onClick={() => onSave(item.id)}>Save for Later</button>
            </>
          ) : (
            <button onClick={() => onMoveToCart(item.id)}>
              Move to Cart
            </button>
          )}
        </div>
      </div>
      <div className="item-price">₹{item.price}</div>
    </div>
  );
};

export default CartItem;
