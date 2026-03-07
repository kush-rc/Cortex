import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const Checkout = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { cart, cartTotal, clearCart } = useCart()

    const [step, setStep] = useState(1) // 1=Address, 2=Payment
    const [processing, setProcessing] = useState(false)
    const [savedAddress, setSavedAddress] = useState(null)
    const [useNewAddress, setUseNewAddress] = useState(false)

    const [address, setAddress] = useState({
        name: '',
        email: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: ''
    })

    const [paymentMethod, setPaymentMethod] = useState('card')
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/28',
        cvv: '123',
        cardName: 'Demo User'
    })
    const [upiId, setUpiId] = useState('demo@cortex')

    // Redirect if not logged in or cart empty
    useEffect(() => {
        if (!user) navigate('/login')
        if (cart.length === 0 && !processing) navigate('/bag')
    }, [user, cart, processing])

    // Fetch saved address on mount
    useEffect(() => {
        fetchSavedAddress()
    }, [])

    const fetchSavedAddress = async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/address`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                if (data.address) {
                    setSavedAddress(data.address)
                    setAddress(data.address)
                }
            }
        } catch (e) {
            console.error('Error fetching address:', e)
        }
    }

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }))
    }

    const isAddressValid = () => {
        return address.name && address.phone && address.line1 && address.city && address.state && address.pincode
    }

    const continueToPayment = () => {
        if (!isAddressValid()) return
        setStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const placeOrder = async () => {
        setProcessing(true)

        const token = localStorage.getItem('token')
        const payment = { method: paymentMethod }

        if (paymentMethod === 'card') {
            payment.cardNumber = cardDetails.cardNumber.replace(/\s/g, '')
            payment.expiry = cardDetails.expiry
        } else if (paymentMethod === 'upi') {
            payment.upiId = upiId
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address, payment })
            })

            if (res.ok) {
                const data = await res.json()
                // Clear frontend cart
                if (clearCart) clearCart()
                // Simulate short processing delay
                setTimeout(() => {
                    navigate(`/order-confirmation/${data.order_id}`)
                }, 1500)
            } else {
                const err = await res.json()
                alert(err.error || 'Checkout failed')
                setProcessing(false)
            }
        } catch (e) {
            console.error('Checkout error:', e)
            alert('Something went wrong. Please try again.')
            setProcessing(false)
        }
    }

    if (!user || (cart.length === 0 && !processing)) return null

    const showSavedAddress = savedAddress && !useNewAddress && step === 1

    return (
        <div className="checkout-page">
            {processing && (
                <div className="processing-overlay">
                    <div className="processing-spinner" />
                    <p>Processing your payment...</p>
                </div>
            )}

            <div className="checkout-container">
                <h1 className="checkout-title">Checkout</h1>
                <p className="checkout-subtitle">Review your details and complete your purchase.</p>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    <div className={`checkout-step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <span className="checkout-step-num">{step > 1 ? '✓' : '1'}</span>
                        <span>Address</span>
                    </div>
                    <div className={`checkout-step-divider ${step > 1 ? 'completed' : ''}`} />
                    <div className={`checkout-step-item ${step >= 2 ? 'active' : ''}`}>
                        <span className="checkout-step-num">2</span>
                        <span>Payment</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    {/* ===== LEFT: Form Area ===== */}
                    <div className="checkout-form-area">

                        {/* ===== STEP 1: ADDRESS ===== */}
                        {step === 1 && (
                            <div className="checkout-card">
                                <h2>Shipping Address</h2>

                                {showSavedAddress ? (
                                    <>
                                        <div className="saved-address-card">
                                            <span className="saved-badge">SAVED</span>
                                            <p>
                                                <strong>{savedAddress.name}</strong><br />
                                                {savedAddress.email && <>{savedAddress.email}<br /></>}
                                                {savedAddress.phone}<br />
                                                {savedAddress.line1}<br />
                                                {savedAddress.line2 && <>{savedAddress.line2}<br /></>}
                                                {savedAddress.city}, {savedAddress.state} — {savedAddress.pincode}
                                            </p>
                                            <button className="edit-btn" onClick={() => setUseNewAddress(true)}>
                                                Edit address
                                            </button>
                                        </div>
                                        <button className="btn-checkout-primary" onClick={continueToPayment}>
                                            Continue to Payment
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Full Name *</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={address.name}
                                                    onChange={e => handleAddressChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={address.email}
                                                    onChange={e => handleAddressChange('email', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={address.phone}
                                                    onChange={e => handleAddressChange('phone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Address Line 1 *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Flat / House No., Building"
                                                    value={address.line1}
                                                    onChange={e => handleAddressChange('line1', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Address Line 2</label>
                                                <input
                                                    type="text"
                                                    placeholder="Street, Area, Landmark (Optional)"
                                                    value={address.line2}
                                                    onChange={e => handleAddressChange('line2', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>City *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Mumbai"
                                                    value={address.city}
                                                    onChange={e => handleAddressChange('city', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>State *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Maharashtra"
                                                    value={address.state}
                                                    onChange={e => handleAddressChange('state', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Pincode *</label>
                                                <input
                                                    type="text"
                                                    placeholder="400001"
                                                    value={address.pincode}
                                                    onChange={e => handleAddressChange('pincode', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className="btn-checkout-primary"
                                            disabled={!isAddressValid()}
                                            onClick={continueToPayment}
                                        >
                                            Continue to Payment
                                        </button>

                                        {savedAddress && (
                                            <button className="btn-checkout-secondary" onClick={() => {
                                                setUseNewAddress(false)
                                                setAddress(savedAddress)
                                            }}>
                                                ← Use saved address
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* ===== STEP 2: PAYMENT ===== */}
                        {step === 2 && (
                            <div className="checkout-card">
                                <h2>Payment Method</h2>

                                <div className="payment-methods">
                                    {/* CARD */}
                                    <div
                                        className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="payment-radio">
                                            <div className="payment-radio-inner" />
                                        </div>
                                        <div className="payment-info">
                                            <h4>💳 Credit / Debit Card</h4>
                                            <p>Pay securely with your card</p>

                                            {paymentMethod === 'card' && (
                                                <div className="payment-detail-fields">
                                                    <span className="payment-demo-note">🔒 Demo card pre-filled</span>
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>Card Number</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.cardNumber}
                                                                onChange={e => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>Name on Card</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.cardName}
                                                                onChange={e => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Expiry</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.expiry}
                                                                onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>CVV</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.cvv}
                                                                onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* UPI */}
                                    <div
                                        className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('upi')}
                                    >
                                        <div className="payment-radio">
                                            <div className="payment-radio-inner" />
                                        </div>
                                        <div className="payment-info">
                                            <h4>📱 UPI</h4>
                                            <p>Pay using UPI ID (Google Pay, PhonePe, Paytm)</p>

                                            {paymentMethod === 'upi' && (
                                                <div className="payment-detail-fields">
                                                    <span className="payment-demo-note">🔒 Demo UPI ID pre-filled</span>
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>UPI ID</label>
                                                            <input
                                                                type="text"
                                                                value={upiId}
                                                                onChange={e => setUpiId(e.target.value)}
                                                                placeholder="yourname@upi"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* BANK TRANSFER */}
                                    <div
                                        className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('bank')}
                                    >
                                        <div className="payment-radio">
                                            <div className="payment-radio-inner" />
                                        </div>
                                        <div className="payment-info">
                                            <h4>🏦 Net Banking</h4>
                                            <p>Pay directly from your bank account</p>

                                            {paymentMethod === 'bank' && (
                                                <div className="payment-detail-fields">
                                                    <span className="payment-demo-note">Demo bank transfer</span>
                                                    <p style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.6' }}>
                                                        <strong>Account:</strong> 1234 5678 9012<br />
                                                        <strong>IFSC:</strong> DEMO0001234<br />
                                                        <strong>Bank:</strong> Cortex Demo Bank<br />
                                                        <em style={{ color: '#6e6e73', fontSize: '12px' }}>Transfer will be simulated on checkout.</em>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                </div>

                                <button className="btn-checkout-primary" onClick={placeOrder}>
                                    Place Order — ₹{cartTotal.toLocaleString('en-IN')}.00
                                </button>
                                <button className="btn-checkout-secondary" onClick={() => setStep(1)}>
                                    ← Back to Address
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ===== RIGHT: Order Summary ===== */}
                    <div className="checkout-summary-area">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>

                            {cart.map((item, i) => (
                                <div key={i} className="summary-item">
                                    <div className="summary-item-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="summary-item-info">
                                        <h4>{item.name}</h4>
                                        <p>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free-tag">FREE</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (incl.)</span>
                                    <span>₹0</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
