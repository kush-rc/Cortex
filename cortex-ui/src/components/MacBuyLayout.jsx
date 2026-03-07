import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './MacBuyLayout.css'

const MacBuyLayout = ({ product }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    // Selection state
    const [selectedSize, setSelectedSize] = useState('13-inch')
    const [selectedColor, setSelectedColor] = useState({
        name: 'Midnight',
        img: 'mac13&15_6.jpg',
        hex: '#2e3641'
    })
    const [selectedChip, setSelectedChip] = useState('8-core GPU')
    const [selectedMemory, setSelectedMemory] = useState('16GB')
    const [selectedStorage, setSelectedStorage] = useState('256GB')
    const [isPriceUpdated, setIsPriceUpdated] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showToast, setShowToast] = useState(false)
    const [isHidingToast, setIsHidingToast] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const prevPriceRef = useRef(0)

    // Scroll listener for sticky header transition
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Image Sets for each color (Mapping available local images)
    const imageSets = {
        'Midnight': [
            'mac13&15_6.jpg', // Main view
            'mac13&15_1.jpg', // Group view or alt
            'mac13&15_2.jpg'  // Detailed view
        ],
        'Starlight': [
            'mac13&15_5.jpg',
            'mac13&15_1.jpg',
            'mac13&15_2.jpg'
        ],
        'Silver': [
            'mac13&15_4.jpg',
            'mac13&15_1.jpg',
            'mac13&15_2.jpg'
        ],
        'Sky Blue': [
            'mac13&15_3.jpg',
            'mac13&15_1.jpg',
            'mac13&15_2.jpg'
        ]
    }

    const currentImages = imageSets[selectedColor.name] || imageSets['Midnight']

    // Reset carousel when color changes
    useEffect(() => {
        setCurrentImageIndex(0)
    }, [selectedColor])

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
    }

    // Base prices
    const prices = {
        '13-inch': 99900,
        '15-inch': 124900
    }

    // Upgrades
    const upgrades = {
        chip: { '10-core GPU': 20000 },
        memory: { '24GB': 20000, '32GB': 40000 },
        storage: { '512GB': 20000, '1TB': 40000, '2TB': 80000 }
    }

    const calculateTotal = () => {
        let total = prices[selectedSize] || 99900
        if (selectedChip === '10-core GPU') total += upgrades.chip['10-core GPU']
        if (upgrades.memory[selectedMemory]) total += upgrades.memory[selectedMemory]
        if (upgrades.storage[selectedStorage]) total += upgrades.storage[selectedStorage]
        return total
    }

    const totalPrice = calculateTotal()

    // Price change animation effect
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
            // If not logged in, redirect to login
            navigate('/login')
            return
        }

        // Prepare the configuration object
        const configuration = {
            id: `${product._id}-${selectedSize}-${selectedColor.name}-${selectedChip}-${selectedMemory}-${selectedStorage}`,
            name: `${product.name} (${selectedSize})`,
            price: totalPrice,
            color: selectedColor.name,
            specs: {
                chip: selectedChip,
                memory: selectedMemory,
                storage: selectedStorage
            },
            image: `${import.meta.env.VITE_API_URL || ""}/static/product_images/Mac/Macbook_Air_13''_and_15''/${selectedColor.img}`
        }

        const success = await addToCart(configuration, 1)
        if (success) {
            // Trigger custom toast instead of alert
            setShowToast(true)
            setIsHidingToast(false)
            setTimeout(() => {
                setIsHidingToast(true)
                setTimeout(() => setShowToast(false), 400)
            }, 3000)
        } else {
            alert('Could not add to Bag. Please try again.')
        }
    }

    const colors = [
        { name: 'Midnight', img: 'mac13&15_6.jpg', hex: '#2e3641' },
        { name: 'Starlight', img: 'mac13&15_5.jpg', hex: '#f0eada' },
        { name: 'Silver', img: 'mac13&15_4.jpg', hex: '#e3e4e5' },
        { name: 'Sky Blue', img: 'mac13&15_3.jpg', hex: '#dce5ef' }
    ]

    // Logic for EMI and Price
    const emiPrice = Math.round((totalPrice - 10000) / 6)

    return (
        <div className="rf-bfe-mac">
            {/* Success Toast Overlay */}
            {showToast && (
                <div className="rf-bfe-toast-container">
                    <div className={`rf-bfe-toast ${isHidingToast ? 'hiding' : ''}`}>
                        <div className="rf-bfe-toast-icon">✓</div>
                        <span>Added to your Bag!</span>
                    </div>
                </div>
            )}

            {/* Promo Ribbon */}
            <div className="rf-bfe-ribbon">
                <div className="container text-center">
                    <p>
                        Get up to 6 months of No Cost EMI plus up to ₹10,000.00 instant cashback on selected Mac models.
                    </p>
                </div>
            </div>

            {/* Refined Header Wrapper (Compact Sticky) */}
            <header className={`rf-bfe-header-wrapper ${isScrolled ? 'is-visible' : ''}`}>
                <div className="rf-bfe-header-container">
                    <div className="rf-bfe-header">
                        <div className="rf-bfe-header-left">
                            <h1>{product.name}</h1>
                        </div>
                        <div className="rf-bfe-header-right">
                            <div className="rf-bfe-header-price">
                                <span className="rf-bfe-header-emi">
                                    From ₹{emiPrice.toLocaleString('en-IN')}.00/mo. with instant cashback^ and No Cost EMI° or {' '}
                                </span>
                                <span className={`price-value ${isPriceUpdated ? 'updated' : ''}`}>
                                    ₹{totalPrice.toLocaleString('en-IN')}.00+
                                </span>
                            </div>
                            <div className="rf-bfe-header-shipping">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20,8H17V4H3C1.9,4,1,4.9,1,6v11h2c0,1.66,1.34,3,3,3s3-1.34,3-3h6c0,1.66,1.34,3,3,3s3-1.34,3-3h2v-5L20,8z M6,18.5 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S6.83,18.5,6,18.5z M13,12H4V6h9V12z M18,18.5c-0.83,0-1.5-0.67-1.5-1.5 s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S18.83,18.5,18,18.5z M19,13h-5V9h4.46L19,11.31V13z" />
                                </svg>
                                <span>Free shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Header Section (Initial State) */}
            <section className="rf-bfe-hero-header">
                <div className="rf-bfe-hero-header-container">
                    <h1>Buy {product.name}</h1>
                    <div className="rf-bfe-hero-price-summary">
                        <span className="as-emi">
                            From ₹{emiPrice.toLocaleString('en-IN')}.00/mo. with instant cashback^ and No Cost EMI°
                        </span>
                        <span className="as-total">
                            or ₹{totalPrice.toLocaleString('en-IN')}.00+
                        </span>
                    </div>
                </div>
            </section>

            <main className="rf-bfe-main">
                {/* Left Column: Interactive Gallery */}
                <div className="rf-bfe-column-left">
                    <div className="rf-bfe-gallery-container">
                        <div className="rf-bfe-gallery">
                            <img
                                src={`${import.meta.env.VITE_API_URL || ""}/static/product_images/Mac/Macbook_Air_13''_and_15''/${currentImages[currentImageIndex]}`}
                                alt={`MacBook Air ${selectedColor.name}`}
                                className="rf-bfe-gallery-image"
                            />
                        </div>

                        {/* Carousel Controls */}
                        <div className="rf-bfe-gallery-controls">
                            <button className="rf-bfe-gallery-arrow" onClick={handlePrevImage} aria-label="Previous image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>

                            <div className="rf-bfe-gallery-dots">
                                {currentImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`rf-bfe-dot ${currentImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    />
                                ))}
                            </div>

                            <button className="rf-bfe-gallery-arrow" onClick={handleNextImage} aria-label="Next image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scrollable Config */}
                <div className="rf-bfe-column-right">
                    {/* Size Step */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            Model. <span className="as-subheading">Choose your size.</span>
                        </h2>
                        <div className="form-selector-group">
                            <div
                                className={`form-selector size-selector ${selectedSize === '13-inch' ? 'selected' : ''}`}
                                onClick={() => setSelectedSize('13-inch')}
                            >
                                <span className="form-selector-title">34.46cm - 13"<sup>1</sup></span>
                                <div className="form-selector-price-details">
                                    <span className="price-emi">From ₹{(Math.round((99900 - 10000) / 6)).toLocaleString('en-IN')}.00/mo. with instant cashback<sup>Δ</sup> and No Cost EMI<sup>°</sup></span>
                                    <span className="price-total">or ₹99,900.00<sup>‡</sup></span>
                                </div>
                            </div>
                            <div
                                className={`form-selector size-selector ${selectedSize === '15-inch' ? 'selected' : ''}`}
                                onClick={() => setSelectedSize('15-inch')}
                            >
                                <span className="form-selector-title">38.91cm - 15"<sup>1</sup></span>
                                <div className="form-selector-price-details">
                                    <span className="price-emi">From ₹{(Math.round((124900 - 10000) / 6)).toLocaleString('en-IN')}.00/mo. with instant cashback<sup>Δ</sup> and No Cost EMI<sup>°</sup></span>
                                    <span className="price-total">or ₹1,24,900.00<sup>‡</sup></span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Color Step */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            Finish. <span className="as-subheading">Pick your favorite.</span>
                        </h2>
                        <ul className="colornav-items">
                            {colors.map(color => (
                                <li key={color.name} className="colornav-item" onClick={() => setSelectedColor(color)}>
                                    <div
                                        className={`colornav-swatch ${selectedColor.name === color.name ? 'active' : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                    <span className="colornav-label">{color.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Chip Step */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            M4 chip. <span className="as-subheading">Choose your processing power.</span>
                        </h2>
                        <div className="form-selector-group">
                            <div
                                className={`form-selector ${selectedChip === '8-core GPU' ? 'selected' : ''}`}
                                onClick={() => setSelectedChip('8-core GPU')}
                            >
                                <div>
                                    <span className="form-selector-title">10‑core CPU, 8‑core GPU</span>
                                    <p className="form-label-small" style={{ fontSize: '12px', marginTop: '4px' }}>Great for everyday tasks.</p>
                                </div>
                                <span className="form-label-small">Included</span>
                            </div>
                            <div
                                className={`form-selector ${selectedChip === '10-core GPU' ? 'selected' : ''}`}
                                onClick={() => setSelectedChip('10-core GPU')}
                            >
                                <div>
                                    <span className="form-selector-title">10‑core CPU, 10‑core GPU</span>
                                    <p className="form-label-small" style={{ fontSize: '12px', marginTop: '4px' }}>Boost for creative work.</p>
                                </div>
                                <span className="form-label-small">+ ₹20,000</span>
                            </div>
                        </div>
                    </section>

                    {/* Memory Step */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            Unified Memory. <span className="as-subheading">Choose your multitasking power.</span>
                        </h2>
                        <div className="form-selector-group">
                            {['16GB', '24GB', '32GB'].map(mem => (
                                <div
                                    key={mem}
                                    className={`form-selector ${selectedMemory === mem ? 'selected' : ''}`}
                                    onClick={() => setSelectedMemory(mem)}
                                >
                                    <span className="form-selector-title">{mem} unified memory</span>
                                    <span className="form-label-small">
                                        {mem === '16GB' ? 'Included' : `+ ₹${upgrades.memory[mem].toLocaleString('en-IN')}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Storage Step */}
                    <section className="rf-bfe-step">
                        <h2 className="rs-mac-bfe-step-header">
                            SSD Storage. <span className="as-subheading">How much space do you need?</span>
                        </h2>
                        <div className="form-selector-group">
                            {['256GB', '512GB', '1TB', '2TB'].map(st => (
                                <div
                                    key={st}
                                    className={`form-selector ${selectedStorage === st ? 'selected' : ''}`}
                                    onClick={() => setSelectedStorage(st)}
                                >
                                    <span className="form-selector-title">{st} SSD storage</span>
                                    <span className="form-label-small">
                                        {st === '256GB' ? 'Included' : `+ ₹${upgrades.storage[st].toLocaleString('en-IN')}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Summary Section */}
            <div className="rf-bfe-summary">
                <div className="container">
                    <h2 className="rf-bfe-summary-header">Your new MacBook Air awaits.</h2>
                    <p className="as-subheading">Make it yours.</p>
                    <div className="rf-bfe-summary-price">
                        Total: ₹{totalPrice.toLocaleString('en-IN')}
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

export default MacBuyLayout
