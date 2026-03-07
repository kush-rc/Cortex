import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { colorMap } from '../utils/productUtils'
import ImageGallery from './ImageGallery'
import './MacBuyLayout.css'

const PremiumiPadBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    const getOptionName = (opt) => typeof opt === 'object' ? opt.name : opt

    const [selectedOptions, setSelectedOptions] = useState({
        size: product.sizes ? getOptionName(product.sizes[0]) : null,
        color: product.colors ? product.colors[0] : null,
        storage: product.storage ? product.storage[0] : (product.name?.includes('Air') ? '128GB' : '256GB'),
        displayGlass: 'Standard glass',
        connectivity: 'Wi-Fi',
        pencil: 'No',
        keyboard: 'No'
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

        // Base price calculation based on size
        if (product.pricing && selectedOptions.size) {
            if (selectedOptions.size.includes('13″')) {
                total = product.pricing['13-inch model'] || product.price
            } else {
                total = product.pricing['11-inch model'] || product.price
            }
        }

        // Storage surcharges (using explicit mapping from seed data)
        const storageSurcharge = product.storage_prices?.[selectedOptions.storage] || 0
        total += storageSurcharge

        // Glass surcharge
        if (selectedOptions.displayGlass === 'Nano-texture glass') {
            total += 10000
        }

        // Connectivity surcharge
        if (selectedOptions.connectivity === 'Wi-Fi + Cellular') {
            const connectivityOption = product.connectivity?.find(c => c.name === 'Wi-Fi + Cellular')
            total += connectivityOption?.price || 15000
        }

        // Accessory surcharges
        if (product.accessories) {
            const pencilAcc = product.accessories.find(a => a.name === selectedOptions.pencil)
            if (pencilAcc) total += pencilAcc.price

            const keyboardAcc = product.accessories.find(a => a.name === selectedOptions.keyboard)
            if (keyboardAcc) total += keyboardAcc.price
        } else {
            // Fallback for legacy/hardcoded
            if (selectedOptions.pencil === 'Apple Pencil Pro') total += 11900
            if (selectedOptions.pencil === 'Apple Pencil (USB-C)') total += 7900

            if (selectedOptions.keyboard === 'Magic Keyboard') {
                const is13Inch = selectedOptions.size?.includes('13″')
                if (product.name?.includes('Air')) {
                    total += is13Inch ? 29900 : 26900
                } else {
                    total += is13Inch ? 33900 : 29900
                }
            }
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
            name: `${product.name} (${selectedOptions.size})`,
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

    const getEMI = (price) => Math.round((price - 4000) / 6).toLocaleString('en-IN')
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

            <div className="rf-bfe-ribbon">
                <div className="container text-center">
                    <p>{product.ribbon_text || "Get up to ₹4000.00 instant cashback on iPad with eligible cards."}</p>
                </div>
            </div>

            <header className={`rf-bfe-header-wrapper ${isScrolled ? 'is-visible' : ''}`}>
                <div className="rf-bfe-header-container">
                    <div className="rf-bfe-header">
                        <div className="rf-bfe-header-left">
                            <h1>{product.name}</h1>
                        </div>
                        <div className="rf-bfe-header-right">
                            <div className="rf-bfe-header-price">
                                <span className="rf-bfe-header-emi">
                                    From ₹{currentEMI}/mo. or {' '}
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
                            From ₹{currentEMI}/mo. or ₹{totalPrice.toLocaleString('en-IN')}.00<sup>†</sup>
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

                    {/* Size Selector */}
                    {product.sizes && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Model. <span className="as-subheading">Choose your size.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.sizes.map(size => {
                                    const sName = getOptionName(size)
                                    const isSelected = selectedOptions.size === sName
                                    const basePrice = sName.includes('13″')
                                        ? (product.pricing?.['13-inch model'] || 79900)
                                        : (product.pricing?.['11-inch model'] || 59900)
                                    const cardEMI = getEMI(basePrice)

                                    return (
                                        <div
                                            key={sName}
                                            className={`form-selector size-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, size: sName })}
                                            style={{ minHeight: '120px', padding: '18px 24px' }}
                                        >
                                            <div className="form-selector-left-col" style={{ flex: '1' }}>
                                                <span className="form-selector-title" style={{ fontSize: '19px', fontWeight: '600' }}>
                                                    {sName} {product.name}
                                                </span>
                                                <div className="form-label-small" style={{ marginTop: '4px', fontWeight: '400', color: '#1d1d1f' }}>
                                                    {size.subheading || product.display}
                                                </div>
                                            </div>
                                            <div className="form-selector-price-details" style={{ textAlign: 'right', marginLeft: '20px' }}>
                                                <div style={{ color: '#1d1d1f', fontSize: '12px', lineHeight: '1.4' }}>
                                                    From ₹{cardEMI}/mo.<br />
                                                    with instant<br />
                                                    cashback and No<br />
                                                    Cost EMI<br />
                                                    or ₹{basePrice.toLocaleString('en-IN')}.00
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Color Selector */}
                    {product.colors && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Finish. <span className="as-subheading">Pick your favorite.</span>
                            </h2>
                            <ul className="colornav-items">
                                {product.colors.map(color => {
                                    return (
                                        <li key={color} className="colornav-item" onClick={() => setSelectedOptions({ ...selectedOptions, color })}>
                                            <div
                                                className={`colornav-swatch ${selectedOptions.color === color ? 'active' : ''}`}
                                                style={{ backgroundColor: colorMap[color] || '#ccc' }}
                                            />
                                            <span className="colornav-label">{color}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    )}

                    {/* Storage Step */}
                    {product.storage && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Storage. <span className="as-subheading">Choose your space.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.storage.map((st) => {
                                    const isSelected = selectedOptions.storage === st
                                    const surcharge = product.storage_prices?.[st] || 0

                                    // chip and memory logic
                                    let chipDesc = product.chips?.[0]?.description || product.chip || "Apple chip"
                                    let memDesc = ""

                                    if (product.name?.includes('Pro')) {
                                        memDesc = (st === '256GB' || st === '512GB') ? "12GB memory" : "16GB memory"
                                        chipDesc = (st === '256GB' || st === '512GB')
                                            ? "M5 chip: 9‑core CPU, 10-core GPU"
                                            : "M5 chip: 10‑core CPU, 10-core GPU"
                                    }

                                    return (
                                        <div
                                            key={st}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, storage: st })}
                                            style={{ padding: '20px 24px' }}
                                        >
                                            <div className="form-selector-left-col">
                                                <span className="form-selector-title">
                                                    {st} storage
                                                    {memDesc && <div className="typography-caption" style={{ color: '#1d1d1f', fontSize: '12px', fontWeight: '400', marginTop: '4px' }}>{memDesc}</div>}
                                                    <div className="form-label-small" style={{ color: '#6e6e73', fontWeight: '400', whiteSpace: 'pre-line', marginTop: '2px' }}>{chipDesc}</div>
                                                </span>
                                            </div>
                                            <div className="form-selector-price-details">
                                                <span className="price-total" style={{ fontWeight: '400', fontSize: '12px' }}>
                                                    {surcharge === 0 ? "Included" : `+ ₹${surcharge.toLocaleString('en-IN')}`}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Display Glass (Only for Pro) */}
                    {product.display_glass && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Display glass. <span className="as-subheading">Choose standard or nano-texture glass.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.display_glass.map(glass => {
                                    const isSelected = selectedOptions.displayGlass === glass.name
                                    const isDisabled = glass.name === 'Nano-texture glass' && (selectedOptions.storage === '256GB' || selectedOptions.storage === '512GB')

                                    return (
                                        <div
                                            key={glass.name}
                                            className={`form-selector ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                            onClick={() => !isDisabled && setSelectedOptions({ ...selectedOptions, displayGlass: glass.name })}
                                            style={{ opacity: isDisabled ? 0.5 : 1 }}
                                        >
                                            <span className="form-selector-title">
                                                {glass.name}
                                                {glass.description && <div className="form-label-small">{glass.description}</div>}
                                            </span>
                                            <span className="form-label-small">{glass.price === 0 ? "Included" : `+ ₹${glass.price.toLocaleString('en-IN')}`}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Connectivity */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            Connectivity. <span className="as-subheading">Choose how you’ll stay connected.</span>
                        </h2>
                        <div className="form-selector-group">
                            {product.connectivity?.map(conn => {
                                const isSelected = selectedOptions.connectivity === conn.name
                                return (
                                    <div
                                        key={conn.name}
                                        className={`form-selector ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, connectivity: conn.name })}
                                    >
                                        <span className="form-selector-title">{conn.name}</span>
                                        <span className="form-label-small">{conn.price === 0 ? "Included" : `+ ₹${conn.price.toLocaleString('en-IN')}`}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Accessories */}
                    {product.accessories && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Add Accessories. <span className="as-subheading">Boost your productivity.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.accessories.map(acc => {
                                    const isPencil = acc.name.includes('Pencil')
                                    const isKeyboard = acc.name.includes('Keyboard')

                                    // Determine if this accessory is selected
                                    let isSelected = false
                                    if (isPencil) isSelected = selectedOptions.pencil === acc.name
                                    if (isKeyboard) isSelected = selectedOptions.keyboard === acc.name

                                    return (
                                        <div
                                            key={acc.name}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => {
                                                if (isPencil) {
                                                    setSelectedOptions({ ...selectedOptions, pencil: isSelected ? 'No' : acc.name })
                                                } else if (isKeyboard) {
                                                    setSelectedOptions({ ...selectedOptions, keyboard: isSelected ? 'No' : acc.name })
                                                }
                                            }}
                                        >
                                            <span className="form-selector-title">{acc.name}</span>
                                            <span className="form-label-small">
                                                + ₹{acc.price.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                </div>
            </main>

            <div className="rf-bfe-summary">
                <div className="container">
                    <h2 className="rf-bfe-summary-header">Your new {product.name} awaits.</h2>
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

export default PremiumiPadBuyLayout
