import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { colorMap } from '../utils/productUtils'
import './UniversalBuyLayout.css'

const UniversalBuyLayout = ({ product, type }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    // Selection state
    const [selectedOptions, setSelectedOptions] = useState({
        size: product.sizes ? product.sizes[0] : null,
        color: product.colors ? product.colors[0] : null,
        storage: product.storage ? product.storage[0] : null,
        connectivity: product.connectivity ? product.connectivity[0] : null,
    })

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showToast, setShowToast] = useState(false)
    const [isHidingToast, setIsHidingToast] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [totalPrice, setTotalPrice] = useState(product.price || 0)

    // Scroll listener for sticky header transition
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Calculate dynamic price based on selections
    useEffect(() => {
        let price = product.price || 0
        // Simple mock logic for upgrades if not explicitly in DB
        if (selectedOptions.storage) {
            const storageIndex = product.storage.indexOf(selectedOptions.storage)
            price += (storageIndex * 10000)
        }
        if (selectedOptions.size && product.sizes && product.sizes.length > 1) {
            const sizeIndex = product.sizes.indexOf(selectedOptions.size)
            price += (sizeIndex * 15000)
        }
        setTotalPrice(price)
    }, [selectedOptions, product])

    const handleAddToBag = async () => {
        if (!user) {
            navigate('/login')
            return
        }

        const configuration = {
            id: `${product._id}-${Object.values(selectedOptions).filter(Boolean).join('-')}`,
            name: product.name,
            displayName: `${product.name} (${Object.values(selectedOptions).filter(Boolean).join(', ')})`,
            price: totalPrice,
            options: selectedOptions,
            image: product.image
        }

        const success = await addToCart(configuration, 1)
        if (success) {
            setShowToast(true)
            setIsHidingToast(false)
            setTimeout(() => {
                setIsHidingToast(true)
                setTimeout(() => setShowToast(false), 400)
            }, 3000)
        }
    }

    const emiPrice = Math.round((totalPrice - 10000) / 6)

    return (
        <div className="universal-buy-page">
            {/* Success Toast */}
            {showToast && (
                <div className="success-toast-container">
                    <div className={`success-toast ${isHidingToast ? 'hiding' : ''}`}>
                        <div className="toast-icon">✓</div>
                        <span>Added to your Bag!</span>
                    </div>
                </div>
            )}

            {/* Promo Ribbon */}
            <div className="universal-ribbon">
                <div className="container">
                    <p>Get No Cost EMI and instant cashback on selected {product.category} models with eligible cards.</p>
                </div>
            </div>

            {/* Sticky Header */}
            <header className={`sticky-header-wrapper ${isScrolled ? 'is-visible' : ''}`}>
                <div className="sticky-header-container">
                    <div className="sticky-header">
                        <div className="sticky-header-left">
                            <h1>{product.name}</h1>
                        </div>
                        <div className="sticky-header-right">
                            <span className="card-total">₹{totalPrice.toLocaleString('en-IN')}.00</span>
                            <button className="btn-buy-small" onClick={handleAddToBag}>Buy</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Header */}
            <section className="universal-hero-header">
                <div className="universal-hero-header-container">
                    <h1>Buy {product.name}</h1>
                    <div className="universal-hero-price-summary">
                        From ₹{totalPrice.toLocaleString('en-IN')}.00 or ₹{emiPrice.toLocaleString('en-IN')}.00/mo.
                    </div>
                </div>
            </section>

            <main className="universal-main">
                {/* Gallery */}
                <div className="column-left">
                    <div className="gallery-container">
                        <div className="gallery-image-viewport">
                            <img src={product.image} alt={product.name} className="gallery-image" />
                        </div>
                    </div>
                </div>

                {/* Configurations */}
                <div className="column-right">
                    {/* Size Selector */}
                    {product.sizes && (
                        <div className="config-step">
                            <h2 className="step-header">Model. <span className="subheading">Choose your size.</span></h2>
                            <div className="selector-group">
                                {product.sizes.map(size => (
                                    <div
                                        key={size}
                                        className={`selector-card ${selectedOptions.size === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, size })}
                                    >
                                        <span className="card-title">{size}</span>
                                        <div className="card-price-details">
                                            <span className="card-total">₹{totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selector */}
                    {product.colors && (
                        <div className="config-step">
                            <h2 className="step-header">Finish. <span className="subheading">Pick your favorite.</span></h2>
                            <ul className="swatch-list">
                                {product.colors.map(color => (
                                    <li
                                        key={color}
                                        className="swatch-item"
                                        onClick={() => setSelectedOptions({ ...selectedOptions, color })}
                                    >
                                        <div
                                            className={`swatch-dot ${selectedOptions.color === color ? 'active' : ''}`}
                                            style={{ backgroundColor: colorMap[color] || '#ccc' }}
                                        />
                                        <span className="swatch-label">{color}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Storage Selector */}
                    {product.storage && (
                        <div className="config-step">
                            <h2 className="step-header">Storage. <span className="subheading">Choose your capacity.</span></h2>
                            <div className="selector-group">
                                {product.storage.map(size => (
                                    <div
                                        key={size}
                                        className={`selector-card ${selectedOptions.storage === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, storage: size })}
                                    >
                                        <span className="card-title">{size}</span>
                                        <span className="card-emi">Included</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action */}
                    <div style={{ padding: '40px 0' }}>
                        <button className="button-block" onClick={handleAddToBag}>Add to Bag</button>
                    </div>

                    {/* Dynamic Tech Specs */}
                    <div className="config-step" style={{ borderTop: '1px solid #d2d2d7', marginTop: '40px' }}>
                        <h2 className="step-header">Tech Specs. <span className="subheading">The details matter.</span></h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            {product.chip && (
                                <div style={{ background: '#f5f5f7', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                                    <div style={{ fontWeight: '600' }}>{product.chip}</div>
                                    <div style={{ fontSize: '12px', color: '#6e6e73' }}>Processing Power</div>
                                </div>
                            )}
                            {product.display && (
                                <div style={{ background: '#f5f5f7', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖥️</div>
                                    <div style={{ fontWeight: '600' }}>{product.display}</div>
                                    <div style={{ fontSize: '12px', color: '#6e6e73' }}>Display</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* What's in the Box */}
                    <div className="config-step" style={{ borderBottom: 'none' }}>
                        <h2 className="step-header">What’s in the Box.</h2>
                        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '12px' }} />
                                <div style={{ fontSize: '12px', fontWeight: '500' }}>{product.name}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f5f5f7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '12px' }}>🔌</div>
                                <div style={{ fontSize: '12px', fontWeight: '500' }}>USB-C Cable</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default UniversalBuyLayout
