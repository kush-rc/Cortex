import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './OrderConfirmation.css'

const OrderConfirmation = () => {
    const { orderId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        fetchOrder()
    }, [user, orderId])

    const fetchOrder = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setOrder(data.order)
            } else {
                console.error("Order not found")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="order-confirmation-page">
                <div className="confirmation-card" style={{ padding: '80px 48px' }}>
                    <div className="processing-spinner" style={{ margin: '0 auto 20px' }}></div>
                    <p>Loading your order...</p>
                </div>
            </div>
        )
    }

    // Fallback if order doesn't exist but we still want to show a success state
    // (e.g. if MongoDB is slow to update)
    if (!order) {
        return (
            <div className="order-confirmation-page">
                <div className="confirmation-card">
                    <div className="success-icon">✓</div>
                    <h1>Thank you.</h1>
                    <p>Your order has been placed successfully.</p>
                    <p style={{ fontSize: '15px', marginTop: '-20px' }}>Order Number: <strong>{orderId}</strong></p>
                    <div className="confirmation-actions" style={{ marginTop: '40px' }}>
                        <Link to="/store" className="btn-primary">Continue Shopping</Link>
                        <Link to="/profile" className="btn-secondary">View Orders</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="order-confirmation-page">
            <div className="confirmation-card">
                <div className="success-icon">✓</div>
                <h1>Thank you.</h1>
                <p>Your order has been placed successfully. We'll send you an email confirmation shortly.</p>

                <div className="order-details-box">
                    <div className="order-detail-row" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                        <div>
                            <div className="order-label">Order Number</div>
                            <div className="order-value">{order.order_id}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="order-label">Estimated Delivery</div>
                            <div className="order-value" style={{ color: '#0071e3' }}>{order.estimated_delivery}</div>
                        </div>
                    </div>
                </div>

                <div className="order-details-box">
                    <div className="order-label" style={{ marginBottom: '12px' }}>Items Ordered</div>
                    <div className="order-items-preview">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-thumb" title={`${item.name} x${item.quantity}`}>
                                <img src={item.image} alt={item.name} />
                            </div>
                        ))}
                    </div>
                    <div className="order-detail-row" style={{ marginTop: '16px', paddingTop: '16px' }}>
                        <div>
                            <div className="order-label">Total Amount</div>
                            <div className="order-value">₹{order.total.toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="order-label">Payment Method</div>
                            <div className="order-value" style={{ textTransform: 'capitalize' }}>
                                {order.payment.method === 'cod' ? 'Pay on Delivery' : order.payment.method}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link to="/store" className="btn-primary">Continue Shopping</Link>
                    <Link to="/profile" className="btn-secondary">View Your Orders</Link>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmation
