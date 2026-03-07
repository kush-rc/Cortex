import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ImageGallery from './ImageGallery'
import './MacBuyLayout.css'

const PremiumWatchBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    const getOptionName = (opt) => typeof opt === 'object' ? opt.name : opt

    const [selectedOptions, setSelectedOptions] = useState({
        material: product.materials ? getOptionName(product.materials[0]) : 'Aluminium',
        size: product.sizes ? getOptionName(product.sizes[0]) : '42mm',
        connectivity: product.connectivity ? getOptionName(product.connectivity[0]) : 'GPS',
        band: product.bands ? getOptionName(product.bands[0]) : 'Sport Band',
        applecare: false
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
        let total = product.price || 0

        // Base price from size pricing
        if (product.pricing && selectedOptions.size) {
            total = product.pricing[selectedOptions.size] || product.price
        }

        // Material surcharge
        const selectedMat = product.materials?.find(m => getOptionName(m) === selectedOptions.material)
        if (selectedMat?.price) total += selectedMat.price

        // Size surcharge (fallback if no pricing object)
        if (!product.pricing) {
            const selectedSize = product.sizes?.find(s => getOptionName(s) === selectedOptions.size)
            if (selectedSize?.price) total += selectedSize.price
        }

        // Connectivity surcharge
        const selectedConn = product.connectivity?.find(c => getOptionName(c) === selectedOptions.connectivity)
        if (selectedConn?.price) total += selectedConn.price

        // Band surcharge
        const selectedBand = product.bands?.find(b => getOptionName(b) === selectedOptions.band)
        if (selectedBand?.price) total += selectedBand.price

        // AppleCare+
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
            name: `${product.name} ${selectedOptions.material} ${selectedOptions.size} ${selectedOptions.connectivity}`,
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

    const getEMI = (price) => Math.round((price - 2000) / 6).toLocaleString('en-IN')

    // Calculate display price for a material option
    const getMaterialPrice = (mat) => {
        let base = product.pricing?.[selectedOptions.size] || product.price || 0
        if (mat.price) base += mat.price
        return base
    }

    // Calculate display price for a size option
    const getSizePrice = (size) => {
        const sName = getOptionName(size)
        let base = product.pricing?.[sName] || (product.price + (size.price || 0))
        const selectedMat = product.materials?.find(m => getOptionName(m) === selectedOptions.material)
        if (selectedMat?.price) base += selectedMat.price
        return base
    }

    // Calculate display price for a connectivity option
    const getConnectivityPrice = (conn) => {
        let base = product.pricing?.[selectedOptions.size] || product.price || 0
        const selectedMat = product.materials?.find(m => getOptionName(m) === selectedOptions.material)
        if (selectedMat?.price) base += selectedMat.price
        if (conn.price) base += conn.price
        return base
    }

    const currentEMI = getEMI(totalPrice)

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
                                    {product.financing ? product.financing.replace(/From\s+/, 'From ') : `From ₹${currentEMI}/mo.`} or {' '}
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
                    <h1>Buy {product.name}</h1>
                    <div className="rf-bfe-hero-price-summary">
                        <span className="as-emi">
                            {product.financing || `From ₹${currentEMI}/mo.`} or ₹{totalPrice.toLocaleString('en-IN')}.00<sup>‡</sup>
                        </span>
                    </div>
                </div>
            </section>

            <main className="rf-bfe-main">
                <div className="rf-bfe-column-left">
                    <div className="rf-bfe-gallery-container" style={{ position: 'sticky', top: '100px' }}>
                        <ImageGallery
                            images={product.images || [product.image]}
                            alt={product.name}
                        />
                    </div>
                </div>

                <div className="rf-bfe-column-right">

                    {/* ===== STEP 1: CASE MATERIAL ===== */}
                    {product.materials && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Case. <span className="as-subheading">Let's start with your material and finish.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.materials.map(m => {
                                    const mName = getOptionName(m)
                                    const isSelected = selectedOptions.material === mName
                                    const matPrice = getMaterialPrice(m)
                                    const matEMI = getEMI(matPrice)
                                    return (
                                        <div
                                            key={mName}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, material: mName })}
                                            style={{ padding: '20px', minHeight: 'auto', flexDirection: 'column', alignItems: 'stretch' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                                                <div style={{ flex: '0 0 auto' }}>
                                                    <div className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>{mName}</div>
                                                    {mName === 'Aluminium' && (
                                                        <div style={{ marginTop: '4px', color: '#6e6e73', fontSize: '12px', lineHeight: '1.4' }}>
                                                            Choice of GPS<br />or GPS + Cellular
                                                        </div>
                                                    )}
                                                    {mName === 'Titanium' && (
                                                        <div style={{ marginTop: '4px', color: '#6e6e73', fontSize: '12px', lineHeight: '1.4' }}>
                                                            Comes with GPS + Cellular
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6e6e73', flexShrink: 0, lineHeight: '1.5' }}>
                                                    <div>From ₹{matEMI}/mo.</div>
                                                    <div>with instant cashback<sup>∆</sup></div>
                                                    <div>and No Cost EMI<sup>◊</sup></div>
                                                    <div style={{ marginTop: '4px' }}>or ₹{matPrice.toLocaleString('en-IN')}.00<sup>‡</sup></div>
                                                </div>
                                            </div>
                                            {m.description && (
                                                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #d2d2d7', fontSize: '13px', color: '#6e6e73', lineHeight: '1.4', width: '100%' }}>
                                                    {m.description}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* ===== STEP 2: CASE SIZE ===== */}
                    {product.sizes && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Case size. <span className="as-subheading">Pick the one that suits you.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.sizes.map(s => {
                                    const sName = getOptionName(s)
                                    const isSelected = selectedOptions.size === sName
                                    const sizePrice = getSizePrice(s)
                                    const sizeEMI = getEMI(sizePrice)
                                    return (
                                        <div
                                            key={sName}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, size: sName })}
                                            style={{ padding: '20px', flexDirection: 'column', alignItems: 'stretch' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                                                <span className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>{sName}</span>
                                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6e6e73', flexShrink: 0, lineHeight: '1.5' }}>
                                                    <div>From ₹{sizeEMI}/mo.</div>
                                                    <div>with instant cashback<sup>∆</sup></div>
                                                    <div>and No Cost EMI<sup>◊</sup></div>
                                                    <div style={{ marginTop: '4px' }}>or ₹{sizePrice.toLocaleString('en-IN')}.00<sup>‡</sup></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* ===== STEP 3: CONNECTIVITY ===== */}
                    {product.connectivity && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Connectivity. <span className="as-subheading">Stay connected with or without your phone nearby.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.connectivity.map(c => {
                                    const cName = getOptionName(c)
                                    const isSelected = selectedOptions.connectivity === cName
                                    const connPrice = getConnectivityPrice(c)
                                    const connEMI = getEMI(connPrice)
                                    return (
                                        <div
                                            key={cName}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, connectivity: cName })}
                                            style={{ padding: '20px', flexDirection: 'column', alignItems: 'stretch' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                                                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                                                    <div className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>{cName}</div>
                                                    {c.description && (
                                                        <div style={{ marginTop: '4px', color: '#6e6e73', fontSize: '12px', lineHeight: '1.4' }}>
                                                            {c.description}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6e6e73', flexShrink: 0, lineHeight: '1.5' }}>
                                                    <div>From ₹{connEMI}/mo.</div>
                                                    <div>with instant cashback<sup>∆</sup></div>
                                                    <div>and No Cost EMI<sup>◊</sup></div>
                                                    <div style={{ marginTop: '4px' }}>or ₹{connPrice.toLocaleString('en-IN')}.00<sup>‡</sup></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* ===== STEP 4: STRAP / BAND ===== */}
                    {product.bands && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Strap. <span className="as-subheading">Discover different styles and pick your favourite.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.bands.map(b => {
                                    const bName = getOptionName(b)
                                    const isSelected = selectedOptions.band === bName
                                    return (
                                        <div
                                            key={bName}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, band: bName })}
                                            style={{ padding: '20px' }}
                                        >
                                            <div className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>{bName}</div>
                                            {b.description && (
                                                <div className="form-label-small" style={{ marginTop: '6px', color: '#6e6e73', fontSize: '13px' }}>
                                                    {b.description}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* ===== STEP 5: APPLECARE+ ===== */}
                    {product.applecare && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                AppleCare+ coverage. <span className="as-subheading">Protect your new Apple Watch.</span>
                            </h2>
                            <div className="form-selector-group">
                                <div
                                    className={`form-selector ${selectedOptions.applecare ? 'selected' : ''}`}
                                    onClick={() => setSelectedOptions({ ...selectedOptions, applecare: true })}
                                    style={{ padding: '20px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '18px' }}></span>
                                        <span className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>Add AppleCare+</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '12px' }}>
                                        From ₹{Math.round(product.applecare / 6).toLocaleString('en-IN')}/mo.<sup>◊</sup> or MRP ₹{product.applecare.toLocaleString('en-IN')}.00
                                        <br /><span style={{ fontSize: '12px' }}>(inclusive of all taxes)</span>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1d1d1f' }}>
                                        <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#0071e3' }}>✓</span>
                                            2 years of unlimited repairs for accidental damage protection
                                        </li>
                                        <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#0071e3' }}>✓</span>
                                            Apple-certified service and support
                                        </li>
                                        <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#0071e3' }}>✓</span>
                                            Priority access to Apple experts
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    className={`form-selector ${!selectedOptions.applecare ? 'selected' : ''}`}
                                    onClick={() => setSelectedOptions({ ...selectedOptions, applecare: false })}
                                    style={{ padding: '20px' }}
                                >
                                    <span className="form-selector-title" style={{ fontSize: '17px', fontWeight: 600 }}>No AppleCare+</span>
                                </div>
                            </div>
                        </section>
                    )}

                </div>
            </main>

            <div className="rf-bfe-summary">
                <div className="container">
                    <h2 className="rf-bfe-summary-header">{product.name}</h2>
                    <div style={{ fontSize: '14px', color: '#6e6e73', marginBottom: '8px' }}>
                        {selectedOptions.material} • {selectedOptions.size} • {selectedOptions.connectivity}
                        {selectedOptions.band ? ` • ${selectedOptions.band}` : ''}
                        {selectedOptions.applecare ? ' • AppleCare+' : ''}
                    </div>
                    <div className="rf-bfe-summary-price">
                        <span className="as-emi" style={{ display: 'block', fontSize: '14px', color: '#6e6e73', marginBottom: '4px' }}>
                            From ₹{getEMI(totalPrice)}/mo. with instant cashback<sup>∆</sup> and No Cost EMI<sup>◊</sup>
                        </span>
                        or ₹{totalPrice.toLocaleString('en-IN')}.00<sup>‡</sup>
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

export default PremiumWatchBuyLayout
