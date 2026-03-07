import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { colorMap } from '../utils/productUtils'
import ImageGallery from './ImageGallery'
import './MacBuyLayout.css' // Reuse the same high-fidelity styling

const PremiumPhoneBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    const getOptionName = (opt) => typeof opt === 'object' ? opt.name : opt

    // Determine the initial model
    const initialModel = product.models ? product.models[0] : null

    const [selectedOptions, setSelectedOptions] = useState({
        model: initialModel ? initialModel.name : product.name,
        color: product.colors ? product.colors[0] : null,
        storage: product.storage ? product.storage[0] : '256GB',
    })

    const [isPriceUpdated, setIsPriceUpdated] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [isHidingToast, setIsHidingToast] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const prevPriceRef = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const calculateTotal = () => {
        // Start with the selected model's base price or the product base price
        let basePrice = product.price || 0
        if (product.models) {
            const selectedModelData = product.models.find(m => m.name === selectedOptions.model)
            if (selectedModelData) basePrice = selectedModelData.price
        }

        let total = basePrice

        // Storage pricing from data
        if (product.storage_prices && selectedOptions.storage) {
            const storageSurcharge = product.storage_prices[selectedOptions.storage] || 0
            total += storageSurcharge
        }

        // AppleCare+ surcharge
        if (selectedOptions.applecare && product.applecare) {
            total += product.applecare
        }

        return total
    }

    const totalPrice = calculateTotal()

    useEffect(() => {
        if (prevPriceRef.current !== totalPrice && prevPriceRef.current !== 0) {
            setIsPriceUpdated(true)
            const timer = setTimeout(() => setIsPriceUpdated(false), 400)
            return () => clearTimeout(timer)
        }
        prevPriceRef.current = totalPrice
    }, [totalPrice])

    const handleAddToBag = async () => {
        if (!user) {
            navigate('/login')
            return
        }

        const configuration = {
            id: `${product._id}-${Object.values(selectedOptions).filter(Boolean).join('-')}`,
            name: `${selectedOptions.model || product.name} ${selectedOptions.storage} ${selectedOptions.color}`,
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

    const emiPrice = Math.round((totalPrice - 5000) / 6)

    return (
        <div className="rf-bfe-mac">
            {showToast && (
                <div className="rf-bfe-toast-container">
                    <div className={`rf-bfe-toast ${isHidingToast ? 'hiding' : ''}`}>
                        <div className="rf-bfe-toast-icon">✓</div>
                        <span>Added to your Bag!</span>
                    </div>
                </div>
            )}

            {/* Ribbon — data-driven */}
            <div className="rf-bfe-ribbon">
                <div className="container text-center">
                    <p>
                        {product.ribbon_text || `Get No Cost EMI and instant cashback on selected ${product.category} models with eligible cards.`}
                    </p>
                </div>
            </div>

            <header className={`rf-bfe-header-wrapper ${isScrolled ? 'is-visible' : ''}`}>
                <div className="rf-bfe-header-container">
                    <div className="rf-bfe-header">
                        <div className="rf-bfe-header-left">
                            <h1>{selectedOptions.model || product.name}</h1>
                        </div>
                        <div className="rf-bfe-header-right">
                            <div className="rf-bfe-header-price">
                                <span className="rf-bfe-header-emi">
                                    From ₹{emiPrice.toLocaleString('en-IN')}.00/mo. or {' '}
                                </span>
                                <span className={`price-value ${isPriceUpdated ? 'updated' : ''}`}>
                                    ₹{totalPrice.toLocaleString('en-IN')}.00
                                </span>
                            </div>
                            <button className="btn-buy-small" onClick={handleAddToBag}>Buy</button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="rf-bfe-hero-header">
                <div className="rf-bfe-hero-header-container">
                    <h1>Buy {selectedOptions.model || product.name}</h1>
                    <div className="rf-bfe-hero-price-summary">
                        <span className="as-emi">
                            From ₹{emiPrice.toLocaleString('en-IN')}.00/mo. or ₹{totalPrice.toLocaleString('en-IN')}.00<sup>†</sup>
                        </span>
                    </div>
                </div>
            </section>

            <main className="rf-bfe-main">
                <div className="rf-bfe-column-left">
                    <div className="rf-bfe-gallery-container">
                        <ImageGallery
                            images={product.images || [product.image]}
                            alt={product.name}
                        />
                    </div>
                </div>

                <div className="rf-bfe-column-right">

                    {/* ======== Model Selector ======== */}
                    {product.models && product.models.length > 1 && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Model. <span className="as-subheading">Which is best for you?</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.models.map(model => (
                                    <div
                                        key={model.name}
                                        className={`form-selector ${selectedOptions.model === model.name ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, model: model.name })}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                            <div>
                                                <span className="form-selector-title">{model.name}</span>
                                                <br />
                                                <span className="form-label-small">{model.display}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="form-label-small">
                                                    {model.financing}
                                                </span>
                                                <br />
                                                <span className="form-label-small">
                                                    or ₹{model.price.toLocaleString('en-IN')}.00
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ======== Color / Finish Selector ======== */}
                    {product.colors && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Finish. <span className="as-subheading">Pick your favourite.</span>
                            </h2>
                            <ul className="colornav-items">
                                {product.colors.map(color => (
                                    <li key={color} className="colornav-item" onClick={() => setSelectedOptions({ ...selectedOptions, color })}>
                                        <div
                                            className={`colornav-swatch ${selectedOptions.color === color ? 'active' : ''}`}
                                            title={color}
                                            style={{ background: colorMap[color] || '#ccc' }}
                                        />
                                        <span className="colornav-label">{color}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* ======== Storage Step ======== */}
                    {product.storage && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Storage. <span className="as-subheading">How much space do you need?</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.storage.map((st) => {
                                    const surcharge = product.storage_prices ? (product.storage_prices[st] || 0) : 0
                                    return (
                                        <div
                                            key={st}
                                            className={`form-selector ${selectedOptions.storage === st ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, storage: st })}
                                        >
                                            <span className="form-selector-title">{st}</span>
                                            <span className="form-label-small">
                                                {surcharge === 0 ? 'Included' : `+ ₹${surcharge.toLocaleString('en-IN')}`}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* ======== AppleCare+ ======== */}
                    {product.applecare && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                AppleCare+ coverage. <span className="as-subheading">Protect your new {selectedOptions.model || product.name}.</span>
                            </h2>
                            <div className="form-selector-group">
                                <div
                                    className={`form-selector ${selectedOptions.applecare ? 'selected' : ''}`}
                                    onClick={() => setSelectedOptions({ ...selectedOptions, applecare: true })}
                                >
                                    <span className="form-selector-title">AppleCare+</span>
                                    <span className="form-label-small">
                                        MRP ₹{product.applecare.toLocaleString('en-IN')}.00
                                    </span>
                                </div>
                                <div
                                    className={`form-selector ${selectedOptions.applecare === false || !selectedOptions.applecare ? 'selected' : ''}`}
                                    onClick={() => setSelectedOptions({ ...selectedOptions, applecare: false })}
                                >
                                    <span className="form-selector-title">No AppleCare+ Coverage</span>
                                </div>
                            </div>
                        </section>
                    )}

                </div>
            </main>

            <div className="rf-bfe-summary">
                <div className="container">
                    <h2 className="rf-bfe-summary-header">Your new {selectedOptions.model || product.name} awaits.</h2>
                    <p className="as-subheading">Make it yours.</p>
                    <div className="rf-bfe-summary-price">
                        Total: ₹{totalPrice.toLocaleString('en-IN')}.00<sup>†</sup>
                    </div>
                    <button className="button-block" onClick={handleAddToBag}>
                        Add to Bag
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '14px', color: '#6e6e73' }}>
                        Free shipping. Easy returns.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PremiumPhoneBuyLayout
