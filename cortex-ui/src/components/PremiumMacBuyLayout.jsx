import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { colorMap } from '../utils/productUtils'
import ImageGallery from './ImageGallery'
import './MacBuyLayout.css'

const PremiumMacBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    // Helper to get name if option is an object
    const getOptionName = (opt) => typeof opt === 'object' ? opt.name : opt

    // Initialize state dynamically based on product
    const [selectedOptions, setSelectedOptions] = useState({
        size: product.sizes ? getOptionName(product.sizes[0]) : null,
        color: product.colors ? product.colors[0] : null,
        displayFinish: product.display_finishes ? getOptionName(product.display_finishes[0]) : null,
        chip: product.chips ? product.chips[0].name : (product.chip || null),
        memory: product.memory ? product.memory[0] : '16GB',
        storage: product.storage ? product.storage[0] : '512GB',
        software: []
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

        // Size pricing
        if (product.pricing && selectedOptions.size) {
            total = product.pricing[selectedOptions.size] || total
        }

        // Chip pricing
        if (product.chips && selectedOptions.chip) {
            const chipObj = product.chips.find(c => c.name === selectedOptions.chip)
            if (chipObj) total += chipObj.price
        }

        // Display finish pricing (Nano-texture is usually + ₹15,000)
        if (selectedOptions.displayFinish === 'Nano-texture display') {
            total += 15000
        }

        // Memory pricing
        if (product.memory && selectedOptions.memory) {
            const memIndex = product.memory.indexOf(selectedOptions.memory)
            total += (memIndex * 20000)
        }

        // Storage pricing
        if (product.storage && selectedOptions.storage) {
            const stIndex = product.storage.indexOf(selectedOptions.storage)
            total += (stIndex * 20000)
        }

        // Software bundles
        if (selectedOptions.software.length > 0) {
            selectedOptions.software.forEach(swName => {
                const sw = product.software?.find(s => s.name === swName)
                if (sw) total += sw.price
            })
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

    const emiPrice = Math.round((totalPrice - 10000) / 6)

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
                    <p>
                        Get No Cost EMI and instant cashback on selected Mac models with eligible cards.
                    </p>
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
                    <h1>Buy {product.name}</h1>
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
                                    return (
                                        <div
                                            key={sName}
                                            className={`form-selector size-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, size: sName })}
                                        >
                                            <div className="form-selector-left-col">
                                                <span className="form-selector-title">
                                                    {sName} {size.footnote && <sup style={{ fontSize: '10px' }}>{size.footnote}</sup>}
                                                    {size.subheading && <div className="form-label-small" style={{ marginTop: '4px', fontWeight: '400', color: '#6e6e73' }}>{size.subheading}</div>}
                                                </span>
                                            </div>
                                            <div className="form-selector-price-details">
                                                <span className="price-total">₹{product.pricing?.[sName]?.toLocaleString('en-IN') || product.price.toLocaleString('en-IN')}</span>
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
                                {product.colors.map(color => (
                                    <li key={color} className="colornav-item" onClick={() => setSelectedOptions({ ...selectedOptions, color })}>
                                        <div
                                            className={`colornav-swatch ${selectedOptions.color === color ? 'active' : ''}`}
                                            style={{ backgroundColor: colorMap[color] || '#ccc' }}
                                            title={color}
                                        />
                                        <span className="colornav-label">{color}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Display Finish */}
                    {product.display_finishes && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Display. <span className="as-subheading">Choose the best screen type for your workflow.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.display_finishes.map(finish => {
                                    const fName = getOptionName(finish)
                                    const isSelected = selectedOptions.displayFinish === fName
                                    return (
                                        <div
                                            key={fName}
                                            className={`form-selector ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedOptions({ ...selectedOptions, displayFinish: fName })}
                                            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                        >
                                            <span className="form-selector-title">
                                                {fName}
                                                {finish.description && <div className="form-label-small" style={{ marginTop: '4px', fontWeight: '400', color: '#6e6e73' }}>{finish.description}</div>}
                                            </span>
                                            <span className="form-label-small" style={{ marginTop: '8px', color: '#1d1d1f' }}>
                                                {fName === 'Standard display' ? 'Included' : '+ ₹15,000'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Chip Step */}
                    {product.chips && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Chip. <span className="as-subheading">Choose from these powerful options.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.chips.map(chip => (
                                    <div
                                        key={chip.name}
                                        className={`form-selector ${selectedOptions.chip === chip.name ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, chip: chip.name })}
                                        style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span className="form-selector-title">{chip.name}</span>
                                            <span className="form-label-small" style={{ fontWeight: '600' }}>
                                                {chip.price === 0 ? 'Included' : `+ ₹${chip.price.toLocaleString('en-IN')}`}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '8px', lineHeight: '1.5' }}>{chip.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Memory Step */}
                    {product.memory && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Unified Memory. <span className="as-subheading">Choose your multitasking power.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.memory.map((mem, idx) => (
                                    <div
                                        key={mem}
                                        className={`form-selector ${selectedOptions.memory === mem ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, memory: mem })}
                                    >
                                        <span className="form-selector-title">{mem}</span>
                                        <span className="form-label-small">
                                            {idx === 0 ? 'Included' : `+ ₹${(idx * 20000).toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Storage Step */}
                    {product.storage && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                SSD Storage. <span className="as-subheading">How much space do you need?</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.storage.map((st, idx) => (
                                    <div
                                        key={st}
                                        className={`form-selector ${selectedOptions.storage === st ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions({ ...selectedOptions, storage: st })}
                                    >
                                        <span className="form-selector-title">{st}</span>
                                        <span className="form-label-small">
                                            {idx === 0 ? 'Included' : `+ ₹${(idx * 20000).toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Software Step */}
                    {product.software && (
                        <section className="rf-bfe-step">
                            <h2 className="rs-mac-bfe-step-header">
                                Pro apps. <span className="as-subheading">Pre-installed software.</span>
                            </h2>
                            <div className="form-selector-group">
                                {product.software.map(sw => (
                                    <div
                                        key={sw.name}
                                        className={`form-selector ${selectedOptions.software.includes(sw.name) ? 'selected' : ''}`}
                                        onClick={() => {
                                            const newSw = selectedOptions.software.includes(sw.name)
                                                ? selectedOptions.software.filter(s => s !== sw.name)
                                                : [...selectedOptions.software, sw.name]
                                            setSelectedOptions({ ...selectedOptions, software: newSw })
                                        }}
                                    >
                                        <span className="form-selector-title">{sw.name}</span>
                                        <span className="form-label-small">+ ₹{sw.price.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
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

export default PremiumMacBuyLayout
