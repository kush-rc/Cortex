import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../components/SearchableSelect';
import './Profile.css';

const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]); // Add ticket state
    const [address, setAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Edit states
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingPayment, setIsEditingPayment] = useState(false);

    const [contactForm, setContactForm] = useState({
        email: '', mobile: ''
    });

    const [addressForm, setAddressForm] = useState({
        name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India'
    });
    const [paymentForm, setPaymentForm] = useState({
        method: 'card', cardNumber: '', upiId: '', expiry: ''
    });

    const STATE_CITY_MAP = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
        "Chandigarh": ["Chandigarh"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
        "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
        "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Palampur"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Udupi"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Navi Mumbai"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Puri"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Noida"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
        "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Darjeeling"]
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setContactForm({ email: user.email || '', mobile: user.mobile || '' });
        fetchProfileData();
    }, [user, navigate]);

    const fetchProfileData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Fetch Orders
            const ordersRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ordersRes.ok) {
                const data = await ordersRes.json();
                setOrders(data.orders || []);
            }

            // Fetch Tickets
            const ticketsRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/tickets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ticketsRes.ok) {
                const data = await ticketsRes.json();
                setTickets(data.tickets || []);
            }

            // Fetch Saved Address
            const addressRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/address`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (addressRes.ok) {
                const data = await addressRes.json();
                setAddress(data.address);
                if (data.address) {
                    setAddressForm({ ...data.address, country: 'India' });
                }
            }

            // Fetch Saved Payment
            const paymentRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/payment`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (paymentRes.ok) {
                const data = await paymentRes.json();
                setPaymentMethod(data.payment);
                if (data.payment) {
                    setPaymentForm(prev => ({ ...prev, ...data.payment }));
                }
            }
        } catch (e) {
            console.error("Failed to fetch profile data:", e);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    // Handle return/exchange/cancel actions
    const handleOrderAction = async (orderId, action) => {
        const confirmMsg = {
            return: `Are you sure you want to return order ${orderId}?`,
            exchange: `Are you sure you want to exchange order ${orderId}?`,
            cancel: `Are you sure you want to cancel order ${orderId}?`
        };
        if (!window.confirm(confirmMsg[action])) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/${orderId}/action`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`${data.message}`);
                // Update local state so UI reflects new status immediately
                setOrders(prev => prev.map(o =>
                    o.order_id === orderId ? { ...o, status: data.new_status } : o
                ));
            } else {
                alert(data.error || 'Something went wrong.');
            }
        } catch (err) {
            alert('Failed to process request. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleOrder = (orderId) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    const handleSaveContact = async () => {
        if (!/^\d{10}$/.test(contactForm.mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }
        if (!contactForm.email || !contactForm.email.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/update-contact`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(contactForm)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setIsEditingContact(false);
                alert("Contact information updated successfully.");
            } else {
                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    logout();
                    navigate('/login');
                } else {
                    alert(data.error || 'Failed to update contact information.');
                }
            }
        } catch (e) {
            console.error("Error updating contact:", e);
            alert("An error occurred. Please try again.");
        }
    };

    const handleSaveAddress = async () => {
        // Validation
        if (!/^\d{10}$/.test(addressForm.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }
        if (!/^\d{6}$/.test(addressForm.pincode)) {
            alert("Pincode must be exactly 6 digits.");
            return;
        }
        if (!addressForm.name || !addressForm.line1 || !addressForm.city || !addressForm.state) {
            alert("Please fill in all required fields.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(addressForm)
            });
            const data = await res.json();
            if (res.ok) {
                setAddress(data.address);
                setIsEditingAddress(false);
            } else {
                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    logout();
                    navigate('/login');
                } else {
                    alert(data.error || data.msg || 'An error occurred while saving the address.');
                }
            }
        } catch (e) {
            console.error("Error saving address:", e);
        }
    };

    const handleSavePayment = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(paymentForm)
            });
            const data = await res.json();
            if (res.ok) {
                setPaymentMethod(data.payment);
                setIsEditingPayment(false);
            } else {
                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    logout();
                    navigate('/login');
                } else {
                    alert(data.error || data.msg || 'An error occurred while saving payment details.');
                }
            }
        } catch (e) {
            console.error("Error saving payment:", e);
        }
    };

    return (
        <div className="profile-page fade-in">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="profile-name">{user.username}</h1>
                    <p className="profile-email">{user.email}</p>
                    <button onClick={handleLogout} className="btn-logout">Sign Out</button>
                </div>

                <div className="profile-section">
                    <h2 className="section-title">Your Orders</h2>
                    <div className="orders-list">
                        {loading ? (
                            <p style={{ color: '#6e6e73' }}>Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p style={{ color: '#6e6e73' }}>You haven't placed any orders yet.</p>
                        ) : (
                            orders.map(order => (
                                <div
                                    key={order.order_id}
                                    className={`order-card ${expandedOrderId === order.order_id ? 'expanded' : ''}`}
                                >
                                    {/* Collapsed Header / Toggle Area */}
                                    <div
                                        className="order-summary-row"
                                        onClick={() => toggleOrder(order.order_id)}
                                    >
                                        <div className="order-summary-left">
                                            <span className="order-id">{order.order_id}</span>
                                            <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                                        </div>
                                        <div className="order-summary-right">
                                            <div className="order-summary-info">
                                                <p className="order-date">{order.created_at}</p>
                                                <p className="order-total">₹{order.total.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="order-chevron">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Section */}
                                    {expandedOrderId === order.order_id && (
                                        <div className="order-expanded-details">
                                            <div className="order-items-grid">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="order-item-row">
                                                        <div className="order-item-img">
                                                            <img src={item.image} alt={item.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image'; }} />
                                                        </div>
                                                        <div className="order-item-info">
                                                            <h4>{item.name}</h4>
                                                            <p className="order-item-qty">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="order-item-price">
                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-details-footer">
                                                <div className="detail-col">
                                                    <h5>Delivery</h5>
                                                    <p>
                                                        {order.status === 'Delivered' ? 'Delivered on' : 'Expected by'}{' '}
                                                        <strong>{order.status === 'Delivered' && order.delivered_at ? new Date(order.delivered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : order.estimated_delivery}</strong>
                                                    </p>
                                                </div>
                                                <div className="detail-col">
                                                    <h5>Shipping Address</h5>
                                                    <p>
                                                        {order.address.name}<br />
                                                        {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
                                                    </p>
                                                </div>
                                                <div className="detail-col">
                                                    <h5>Payment Method</h5>
                                                    <p style={{ textTransform: 'capitalize' }}>
                                                        {order.payment.method === 'card' ? `Card (ending in ${order.payment.last4})` : order.payment.method}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Post Purchase Logistics for Delivered Orders */}
                                            {order.status === 'Delivered' && order.delivered_at && (
                                                <div className="post-purchase-actions">
                                                    {(() => {
                                                        const deliveryDate = new Date(order.delivered_at);
                                                        const returnWindow = new Date(deliveryDate);
                                                        returnWindow.setDate(returnWindow.getDate() + 7);
                                                        const today = new Date();
                                                        const isEligible = today <= returnWindow;

                                                        return (
                                                            <>
                                                                <div className="returns-info">
                                                                    <h5>Returns & Support</h5>
                                                                    <p>
                                                                        {isEligible
                                                                            ? `Return or exchange window open until ${returnWindow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                                                            : "The return window for this order has closed."}
                                                                    </p>
                                                                </div>

                                                                <div className="returns-buttons">
                                                                    <button
                                                                        className="btn-pp-action"
                                                                        disabled={!isEligible}
                                                                        onClick={() => handleOrderAction(order.order_id, 'return')}
                                                                    >
                                                                        Return Item
                                                                    </button>
                                                                    <button
                                                                        className="btn-pp-action"
                                                                        disabled={!isEligible}
                                                                        onClick={() => handleOrderAction(order.order_id, 'exchange')}
                                                                    >
                                                                        Exchange
                                                                    </button>
                                                                    <button
                                                                        className="btn-pp-action btn-pp-secondary"
                                                                        onClick={() => alert(`Opening feedback form for Order ${order.order_id}`)}
                                                                    >
                                                                        Leave Feedback
                                                                    </button>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Support Tickets */}
                <div className="profile-section tickets-section fade-in" style={{ animationDelay: '0.15s' }}>
                    <h2 className="section-title">Support Tickets</h2>
                    {tickets.length === 0 ? (
                        <div className="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <p>You have no open support tickets.</p>
                        </div>
                    ) : (
                        <div className="tickets-list">
                            {tickets.map(ticket => (
                                <div key={ticket.ticket_id} className="ticket-card">
                                    <div className="ticket-header">
                                        <span className="ticket-id">{ticket.ticket_id}</span>
                                        <span className={`ticket-status status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <h4 className="ticket-issue">{ticket.issue}</h4>
                                    <div className="ticket-footer">
                                        <span className="ticket-date">
                                            Raised on {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <h2 className="section-title">Account Settings</h2>
                    <div className="settings-grid">

                        {/* Contact Information Setting */}
                        <div className="setting-item">
                            <div className="setting-header">
                                <h3>Contact Information</h3>
                                {!isEditingContact && (
                                    <button className="btn-edit" onClick={() => setIsEditingContact(true)}>
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingContact ? (
                                <div className="setting-form">
                                    <input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number (10 digits) *"
                                        maxLength="10"
                                        value={contactForm.mobile}
                                        onChange={e => setContactForm({ ...contactForm, mobile: e.target.value.replace(/\D/g, '') })}
                                    />
                                    <div className="form-actions">
                                        <button className="btn-cancel" onClick={() => {
                                            setIsEditingContact(false);
                                            setContactForm({ email: user.email || '', mobile: user.mobile || '' });
                                        }}>Cancel</button>
                                        <button className="btn-save" onClick={handleSaveContact}>Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p>
                                    <strong>Email:</strong> {user.email}<br />
                                    <strong>Mobile:</strong> {user.mobile || 'Not set'}
                                </p>
                            )}
                        </div>

                        {/* Shipping Address Setting */}
                        <div className="setting-item">
                            <div className="setting-header">
                                <h3>Shipping Address</h3>
                                {!isEditingAddress && (
                                    <button className="btn-edit" onClick={() => setIsEditingAddress(true)}>
                                        {address ? 'Edit' : 'Add'}
                                    </button>
                                )}
                            </div>

                            {isEditingAddress ? (
                                <div className="setting-form">
                                    <input type="text" placeholder="Full Name *" value={addressForm.name} onChange={e => setAddressForm({ ...addressForm, name: e.target.value })} />
                                    <input type="email" placeholder="Email Address" value={addressForm.email} onChange={e => setAddressForm({ ...addressForm, email: e.target.value })} />
                                    <input type="tel" placeholder="Phone Number (10 digits) *" maxLength="10" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })} />
                                    <input type="text" placeholder="Address Line 1 *" value={addressForm.line1} onChange={e => setAddressForm({ ...addressForm, line1: e.target.value })} />
                                    <input type="text" placeholder="Address Line 2 (Optional)" value={addressForm.line2} onChange={e => setAddressForm({ ...addressForm, line2: e.target.value })} />

                                    <div className="form-row-half">
                                        <SearchableSelect
                                            placeholder="Select State *"
                                            options={Object.keys(STATE_CITY_MAP)}
                                            value={addressForm.state}
                                            onChange={(val) => setAddressForm({ ...addressForm, state: val, city: '' })}
                                        />
                                        <SearchableSelect
                                            placeholder={addressForm.state ? "Select City *" : "Select State First"}
                                            options={STATE_CITY_MAP[addressForm.state] || []}
                                            value={addressForm.city}
                                            onChange={(val) => setAddressForm({ ...addressForm, city: val })}
                                            disabled={!addressForm.state}
                                        />
                                    </div>

                                    <div className="form-row-half">
                                        <input type="text" placeholder="Pincode (6 digits) *" maxLength="6" value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })} />
                                        <input type="text" value="India" disabled className="input-disabled" />
                                    </div>
                                    <div className="form-actions">
                                        <button className="btn-cancel" onClick={() => setIsEditingAddress(false)}>Cancel</button>
                                        <button className="btn-save" onClick={handleSaveAddress}>Save</button>
                                    </div>
                                </div>
                            ) : (
                                address ? (
                                    <p>
                                        <strong>{address.name}</strong><br />
                                        {address.phone}<br />
                                        {address.line1}<br />
                                        {address.line2 && <>{address.line2}<br /></>}
                                        {address.city}, {address.state} — {address.pincode}<br />
                                        India
                                    </p>
                                ) : (
                                    <p className="empty-text">No address saved. Add one for faster checkout.</p>
                                )
                            )}
                        </div>

                        {/* Payment Method Setting */}
                        <div className="setting-item">
                            <div className="setting-header">
                                <h3>Payment Methods</h3>
                                {!isEditingPayment && (
                                    <button className="btn-edit" onClick={() => setIsEditingPayment(true)}>
                                        {paymentMethod ? 'Edit' : 'Add'}
                                    </button>
                                )}
                            </div>

                            {isEditingPayment ? (
                                <div className="setting-form">
                                    <select value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                                        <option value="card">Credit / Debit Card</option>
                                        <option value="upi">UPI</option>
                                    </select>

                                    {paymentForm.method === 'card' ? (
                                        <>
                                            <input type="text" placeholder="Card Number (16 digits)" maxLength="19" value={paymentForm.cardNumber} onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} />
                                            <input type="text" placeholder="MM/YY" maxLength="5" value={paymentForm.expiry} onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })} />
                                        </>
                                    ) : (
                                        <input type="text" placeholder="UPI ID (e.g. name@bank)" value={paymentForm.upiId} onChange={e => setPaymentForm({ ...paymentForm, upiId: e.target.value })} />
                                    )}

                                    <div className="form-actions">
                                        <button className="btn-cancel" onClick={() => setIsEditingPayment(false)}>Cancel</button>
                                        <button className="btn-save" onClick={handleSavePayment}>Save</button>
                                    </div>
                                </div>
                            ) : (
                                paymentMethod ? (
                                    <p>
                                        <strong>Pre-saved Method:</strong><br />
                                        <span style={{ textTransform: 'capitalize' }}>
                                            {paymentMethod.method === 'card' ? `Card ending in ${paymentMethod.last4}` : `UPI: ${paymentMethod.upi_id}`}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="empty-text">No payment method saved.</p>
                                )
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
