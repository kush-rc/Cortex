import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ProductCategory from './pages/ProductCategory';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Support from './pages/Support';
import ComparePage from './pages/ComparePage';
import CompareBar from './components/CompareBar/CompareBar';
import ScrollToTop from './components/ScrollToTop';

/* Protected Route Wrapper */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a spinner
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ChatProvider>
                        <CompareProvider>
                            <ScrollToTop />
                            <div className="app">
                                <Navbar />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="/iphone" element={<ProductCategory category="iphone" />} />
                                    <Route path="/ipad" element={<ProductCategory category="ipad" />} />
                                    <Route path="/mac" element={<ProductCategory category="mac" />} />
                                    <Route path="/watch" element={<ProductCategory category="watch" />} />
                                    <Route path="/airpods" element={<ProductCategory category="airpods" />} />
                                    <Route path="/tv-home" element={<ProductCategory category="tv-home" />} />
                                    <Route path="/product/:id" element={<ProductDetail />} />
                                    <Route path="/support" element={<Support />} />
                                    <Route path="/compare" element={<ComparePage />} />
                                    <Route path="/bag" element={<Cart />} />
                                    <Route
                                        path="/checkout"
                                        element={
                                            <ProtectedRoute>
                                                <Checkout />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/order-confirmation/:orderId"
                                        element={
                                            <ProtectedRoute>
                                                <OrderConfirmation />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                                <Footer />
                                <CompareBar />
                                <ChatWidget />
                            </div>
                        </CompareProvider>
                    </ChatProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
