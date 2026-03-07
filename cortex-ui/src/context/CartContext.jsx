import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();

    // Fetch cart when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch('/api/cart/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []);
            }
            // Don't logout on 401 here — may be a stale token during login transition
        } catch (error) {
            console.error("Cart Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        try {
            const productId = product.id || product._id || product.name;
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    specs: product.specs
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []);
                return true;
            } else {
                const errData = await response.json();
                console.error("Add to Cart failed:", errData);
            }
        } catch (error) {
            console.error("Add to Cart Error:", error);
        }
        return false;
    };

    const updateQuantity = async (productId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []);
            }
        } catch (error) {
            console.error("Update Cart Error:", error);
        }
    };

    const removeFromCart = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []);
            }
        } catch (error) {
            console.error("Remove Cart Error:", error);
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, loading, cartTotal, cartCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
