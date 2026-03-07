import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { colorMap } from '../utils/productUtils'
import ImageGallery from './ImageGallery'
import './MacBuyLayout.css'

const PremiumAccessoryBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    const [selectedOptions, setSelectedOptions] = useState({
        color: product.colors ? product.colors[0] : null,
        engraving: 'none',
        applecare: false,
        selectedModel: 0
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

    const applecarePrice = product.applecare || 0
    const hasModels = product.models && product.models.length > 0
    const activeModel = hasModels ? product.models[selectedOptions.selectedModel] : null
    const basePrice = activeModel ? activeModel.price : (product.price || 0)
    const totalPrice = basePrice + (selectedOptions.applecare ? applecarePrice : 0)

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

        const modelLabel = activeModel ? ` (${activeModel.name})` : ''
        const configuration = {
            id: `${product._id}-${selectedOptions.color || 'default'}${modelLabel}${selectedOptions.applecare ? '-acp' : ''}`,
            name: `${product.name}${modelLabel}${selectedOptions.color ? ` - ${selectedOptions.color}` : ''}${selectedOptions.applecare ? ' with AppleCare+' : ''}`,
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

    const getEMI = (price) => Math.round((price - 1000) / 6).toLocaleString('en-IN')
    const activeFinancing = activeModel ? activeModel.financing : product.financing
    const currentEMI = activeFinancing ? activeFinancing.match(/₹([\d,.]+)/)?.[1] : getEMI(totalPrice)
    const isProAirPods = product.name && product.name.toLowerCase().includes('pro')
    const isTVHome = product.category === 'tv-home'
    const applecareLabel = product.name?.includes('HomePod') ? `AppleCare+ for ${product.name}` :
        product.name?.includes('Apple TV') ? 'AppleCare+ for Apple TV' : 'AppleCare+ for Headphones'

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

            {product.ribbon_text && (
                <div className="rf-bfe-ribbon">
                    <div className="container text-center">
                        <p>{product.ribbon_text}</p>
                    </div>
                </div>
            )}

            <header className={`rf-bfe-header-wrapper ${isScrolled ? 'is-visible' : ''}`}>
                <div className="rf-bfe-header-container">
                    <div className="rf-bfe-header">
                        <div className="rf-bfe-header-left">
                            <h1>{product.name}</h1>
                        </div>
                        <div className="rf-bfe-header-right">
                            <div className="rf-bfe-header-price">
                                <span className="rf-bfe-header-emi">
                                    From ₹{currentEMI}/mo. or{' '}
                                </span>
                                <span className={`price-value ${isPriceUpdated ? 'updated' : ''}`}>
                                    MRP ₹{totalPrice.toLocaleString('en-IN')}.00
                                </span>
                            </div>
                            <button className="btn-buy-small" onClick={handleAddToBag}>Buy</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Flagship Side-by-Side Layout */}
            <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '40px 20px 0' }}>
                <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>

                    {/* LEFT: Product Image + Buystrip */}
                    <div style={{ flex: '1 1 50%', position: 'sticky', top: '80px' }}>
                        <ImageGallery
                            images={product.images || [product.image]}
                            alt={product.name}
                        />
                        {/* Buystrip info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>🚚</span>
                                <span style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.4' }}>
                                    Free delivery, direct to your door.
                                </span>
                            </div>
                            {isProAirPods && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>🏃</span>
                                    <span style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.4' }}>
                                        Get 3 months of Apple Fitness+ and Apple Music free with your {product.name}<sup>∆, +</sup>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Configuration + Summary */}
                    <div style={{ flex: '1 1 50%' }}>

                        {/* Product Header */}
                        <div style={{ marginBottom: '30px' }}>
                            {isProAirPods && (
                                <div style={{
                                    display: 'inline-block',
                                    color: '#bf4800',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    marginBottom: '8px'
                                }}>
                                    Free Engraving
                                </div>
                            )}
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: 600,
                                color: '#1d1d1f',
                                lineHeight: '1.1',
                                letterSpacing: '-0.005em',
                                margin: '0 0 16px'
                            }}>
                                Buy {product.name}
                            </h1>
                            <p style={{
                                fontSize: '14px',
                                color: '#1d1d1f',
                                lineHeight: '1.5',
                                margin: 0,
                                paddingRight: '10px'
                            }}>
                                {product.tagline}
                            </p>
                        </div>

                        {/* Engraving Section (AirPods Pro only) */}
                        {isProAirPods && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: '#1d1d1f',
                                    marginBottom: '14px'
                                }}>
                                    Personalise them for free
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {/* Add Engraving option */}
                                    <div
                                        className={`form-selector ${selectedOptions.engraving === 'add' ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, engraving: 'add' })}
                                        style={{ padding: '18px 20px', cursor: 'pointer' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className="form-selector-title" style={{ fontSize: '15px', fontWeight: 600 }}>
                                                    Add Engraving
                                                </div>
                                                <div style={{ marginTop: '6px', color: '#6e6e73', fontSize: '12px', lineHeight: '1.4' }}>
                                                    Engrave a mix of emoji, names, initials and numbers to make {product.name} unmistakably yours. It's free and arrives just as quick.
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6e6e73', flexShrink: 0, marginLeft: '16px', fontWeight: 500 }}>
                                                Free
                                            </div>
                                        </div>
                                    </div>
                                    {/* No Engraving option */}
                                    <div
                                        className={`form-selector ${selectedOptions.engraving === 'none' ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, engraving: 'none' })}
                                        style={{ padding: '18px 20px', cursor: 'pointer' }}
                                    >
                                        <div className="form-selector-title" style={{ fontSize: '15px', fontWeight: 600 }}>
                                            No Engraving
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Model Selector (for products with multiple models like Apple TV 4K) */}
                        {hasModels && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: '#1d1d1f',
                                    marginBottom: '6px'
                                }}>
                                    Choose your model
                                </h2>
                                <a href="#" style={{
                                    fontSize: '12px',
                                    color: '#0071e3',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginBottom: '16px'
                                }}>
                                    Which {product.name} is right for you? ⊕
                                </a>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {product.models.map((model, idx) => (
                                        <div
                                            key={idx}
                                            className={`form-selector ${selectedOptions.selectedModel === idx ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, selectedModel: idx })}
                                            style={{
                                                padding: '18px 20px',
                                                cursor: 'pointer',
                                                borderRadius: '12px',
                                                border: selectedOptions.selectedModel === idx ? '2px solid #0071e3' : '1px solid #d2d2d7',
                                                background: '#fff',
                                                transition: 'border-color 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <div style={{ flex: '1 1 auto' }}>
                                                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', lineHeight: '1.2' }}>
                                                        {model.name}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6e6e73', marginTop: '4px' }}>
                                                        {model.subtitle}
                                                    </div>
                                                </div>
                                                <div style={{ flex: '0 0 auto', textAlign: 'right', marginLeft: '20px' }}>
                                                    <div style={{ fontSize: '11px', color: '#6e6e73', whiteSpace: 'nowrap' }}>
                                                        {model.financing ? model.financing.replace('with EMI', 'with EMI‡,') : `From ₹${Math.round((model.price - 1000) / 6).toLocaleString('en-IN')}/mo.`}
                                                    </div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginTop: '2px', whiteSpace: 'nowrap' }}>
                                                        ₹{model.price.toLocaleString('en-IN')}.00
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selector (for multi-color products) */}
                        {product.colors && product.colors.length > 1 && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: '#1d1d1f',
                                    marginBottom: '14px'
                                }}>
                                    {isTVHome ? 'Colour' : 'Finish.'} {!isTVHome && <span style={{ fontWeight: 400, color: '#6e6e73' }}>Choose your favourite.</span>}
                                </h2>
                                <ul className="colornav-items">
                                    {product.colors.map(color => (
                                        <li key={color} className="colornav-item" onClick={() => setSelectedOptions({ ...selectedOptions, color })}>
                                            <div
                                                className={`colornav-swatch ${selectedOptions.color === color ? 'active' : ''}`}
                                                title={color}
                                                style={{
                                                    background: colorMap[color] || '#ccc'
                                                }}
                                            />
                                            <span className="colornav-label">{color}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Summary Section */}
                        <div style={{
                            background: '#fbfbfd',
                            borderRadius: '18px',
                            padding: '28px 24px',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#1d1d1f',
                                marginBottom: '16px'
                            }}>
                                {product.name}
                            </h2>

                            {/* AppleCare+ Section */}
                            {applecarePrice > 0 && (
                                <div style={{
                                    borderTop: '1px solid #d2d2d7',
                                    paddingTop: '16px',
                                    marginBottom: '16px'
                                }}>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#1d1d1f',
                                        marginBottom: '12px'
                                    }}>
                                        Add AppleCare+
                                    </h3>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            cursor: 'pointer',
                                            padding: '12px 0'
                                        }}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, applecare: !selectedOptions.applecare })}
                                    >
                                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                                            <span style={{ fontSize: '16px', marginTop: '1px' }}>🍎</span>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f' }}>
                                                    {applecareLabel}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6e6e73', lineHeight: '1.4', marginTop: '4px' }}>
                                                    From ₹{Math.round(applecarePrice / 6).toLocaleString('en-IN')}.00/mo.<sup>§</sup> or MRP ₹{applecarePrice.toLocaleString('en-IN')}.00
                                                    <br />(inclusive of all taxes)
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6e6e73', marginTop: '6px', lineHeight: '1.4' }}>
                                                    {product.name?.includes('Apple TV')
                                                        ? 'Get up to 3 years of unlimited repairs for accidental damage protection and additional tech support.'
                                                        : 'Get up to 2 years of unlimited repairs for accidental damage protection and additional tech support.'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            style={{
                                                background: selectedOptions.applecare ? '#0071e3' : 'none',
                                                color: selectedOptions.applecare ? '#fff' : '#0071e3',
                                                border: `1px solid ${selectedOptions.applecare ? '#0071e3' : '#0071e3'}`,
                                                borderRadius: '980px',
                                                padding: '6px 16px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                marginLeft: '12px'
                                            }}
                                        >
                                            {selectedOptions.applecare ? 'Added' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div style={{
                                borderTop: '1px solid #d2d2d7',
                                paddingTop: '16px'
                            }}>
                                <div style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.6' }}>
                                    <div>
                                        <span style={{ fontWeight: 500 }}>
                                            From ₹{currentEMI}/mo.
                                        </span>
                                        <span style={{ color: '#6e6e73' }}>
                                            {' '}with instant cashback<sup>§§</sup> and No Cost EMI<sup>§</sup>
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '4px' }}>
                                        <span style={{ color: '#6e6e73' }}>or </span>
                                        <span style={{ fontWeight: 500 }}>
                                            MRP ₹{totalPrice.toLocaleString('en-IN')}.00
                                        </span>
                                        <br />
                                        <span style={{ fontSize: '12px', color: '#6e6e73' }}>
                                            (inclusive of all taxes)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Continue / Add to Bag Button */}
                            <button
                                className="button-block"
                                onClick={handleAddToBag}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    borderRadius: '12px',
                                    background: '#0071e3',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Add to Bag
                            </button>

                            {/* Save for Later */}
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #d2d2d7' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>
                                    Need a moment?
                                </h3>
                                <p style={{ fontSize: '12px', color: '#6e6e73', lineHeight: '1.4', marginTop: '4px' }}>
                                    Keep all your selections by saving this device to Your Saves, then come back anytime and pick up right where you left off.
                                </p>
                            </div>
                        </div>

                        {/* Features List (below summary for all products) */}
                        {product.features && product.features.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: '#1d1d1f',
                                    marginBottom: '14px'
                                }}>
                                    Features. <span style={{ fontWeight: 400, color: '#6e6e73' }}>The details you love.</span>
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {product.features.filter(Boolean).map((feature, idx) => (
                                        <li key={idx} style={{
                                            padding: '13px 0',
                                            borderBottom: '1px solid #d2d2d7',
                                            fontSize: '14px',
                                            color: '#1d1d1f',
                                            display: 'flex',
                                            alignItems: 'flex-start'
                                        }}>
                                            <span style={{ color: '#0071e3', marginRight: '10px', fontSize: '16px', fontWeight: 600 }}>✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Product Information Section */}
            <div style={{
                maxWidth: '980px',
                margin: '60px auto 0',
                padding: '0 20px 60px'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1d1d1f', marginBottom: '20px' }}>
                    Product Information
                </h2>
                <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid #d2d2d7', paddingTop: '20px' }}>
                    <div style={{ flex: '0 0 200px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>Overview</h3>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.6' }}>
                            {product.description}
                        </p>
                    </div>
                </div>
                <div style={{
                    marginTop: '30px',
                    fontSize: '12px',
                    color: '#6e6e73',
                    lineHeight: '1.5'
                }}>
                    {product.name} do not include a USB-C Charge Cable or power adapter.
                    We encourage you to use any compatible USB-C charging cable or power adapter.
                </div>
            </div>
        </div>
    )
}

export default PremiumAccessoryBuyLayout
