import React from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, loading } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="cart-page empty">
                <h1 className="cart-empty-title">Your bag is empty.</h1>
                <p className="cart-empty-sub">Sign in to see your items.</p>
                <Link to="/login" className="btn btn-primary mt-4">Sign In</Link>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="cart-page loading-state">
                <div className="cart-loading-spinner"></div>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page empty">
                <div className="cart-empty-icon">🛍️</div>
                <h1 className="cart-empty-title">Your bag is empty.</h1>
                <p className="cart-empty-sub">Free delivery and free returns.</p>
                <Link to="/store" className="btn btn-primary mt-4">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header-section">
                    <h1 className="cart-page-title">Review your bag.</h1>
                    <p className="cart-page-sub">Free delivery and free returns.</p>
                </div>

                <div className="cart-items">
                    {cart.map((item, index) => (
                        <div key={`${item.productId}-${index}`} className="cart-item">
                            <div className="cart-img-wrapper">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <div className="cart-item-top">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    {item.specs && (
                                        <div className="cart-item-specs" style={{ fontSize: '13px', color: '#6e6e73', marginTop: '4px' }}>
                                            {Object.values(item.specs).join(' • ')}
                                        </div>
                                    )}
                                    <p className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="cart-item-controls">
                                    <div className="cart-qty">
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => {
                                                if (item.quantity <= 1) {
                                                    removeFromCart(item.productId)
                                                } else {
                                                    updateQuantity(item.productId, item.quantity - 1)
                                                }
                                            }}
                                        >
                                            −
                                        </button>
                                        <span className="cart-qty-value">{item.quantity}</span>
                                        <button
                                            className="cart-qty-btn"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="cart-remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free-tag">FREE</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button className="btn-checkout" onClick={() => navigate('/checkout')}>Check Out</button>
                    <Link to="/store" className="continue-shopping">Continue Shopping ›</Link>
                </div>
            </div>
        </div>
    )
}

export default Cart
