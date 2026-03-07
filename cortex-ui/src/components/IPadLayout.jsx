import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import './iPadLayout.css'

const IPadLayout = ({ products }) => {
    // Correct Order: Pro, Air, iPad, mini
    const order = ['iPad Pro', 'iPad Air', 'iPad', 'iPad mini']
    const scrollRef = useRef(null)

    const sortedProducts = products.sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name)
    })

    const getColorHex = (colorName) => {
        const map = {
            'Space Black': '#2e2c2e',
            'Silver': '#e3e4e5',
            'Space Grey': '#7d7e80',
            'Space Gray': '#7d7e80',
            'Blue': '#a8c8e6',
            'Pink': '#e8d2d6',
            'Yellow': '#f4e38a',
            'Purple': '#d1cddb',
            'Starlight': '#f0f0e0',
            'Midnight': '#2e3642',
            'Green': '#aee1cd',
            'Orange': '#f5d1b3'
        }
        return map[colorName] || '#cccccc'
    }

    const getCardColor = (name) => {
        if (name.includes('Pro')) return '#1d1d1f' // Black
        if (name.includes('Air')) return '#dcedf4' // Light Blue
        return '#f5f5f7' // Light Gray for others
    }

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = 380 // Larger scroll for larger cards
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    return (
        <div className="ipad-layout">
            <div className="ipad-grid" ref={scrollRef}>
                {sortedProducts.map(product => (
                    <div key={product._id} className="ipad-card">
                        <div className="ipad-header">
                            <h3 className="ipad-title">{product.name}</h3>
                        </div>

                        <div
                            className="ipad-image-container"
                            style={{ backgroundColor: getCardColor(product.name) }}
                        >
                            <Link to={`/product/${product._id}`}>
                                <img src={product.image} alt={product.name} className="ipad-img" />
                            </Link>
                        </div>

                        <div className="ipad-swatches">
                            {product.colors && product.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="swatch-dot"
                                    style={{ backgroundColor: getColorHex(color) }}
                                    title={color}
                                ></div>
                            ))}
                        </div>

                        <div className="ipad-content">
                            <p className="ipad-tagline">{product.tagline}</p>

                            <div className="ipad-pricing">
                                <p className="ipad-price">From ₹{product.price.toFixed(2)}***</p>
                                {product.financing && (
                                    <p className="ipad-financing">{product.financing}****</p>
                                )}
                            </div>

                            <div className="ipad-buttons">
                                <Link to={`/product/${product._id}`} className="btn-pill-blue">Learn more</Link>
                                <Link to={`/product/${product._id}`} className="link-buy">Buy</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="ipad-controls">
                <button className="nav-btn" onClick={() => scroll('left')} aria-label="Previous">
                    <svg viewBox="0 0 36 36" className="nav-icon"><path d="M20 25c-.384 0-.768-.146-1.06-.44l-5.5-5.5a1.5 1.5 0 0 1 0-2.12l5.5-5.5a1.5 1.5 0 1 1 2.12 2.12L16.622 18l4.44 4.44A1.5 1.5 0 0 1 20 25z"></path></svg>
                </button>
                <button className="nav-btn" onClick={() => scroll('right')} aria-label="Next">
                    <svg viewBox="0 0 36 36" className="nav-icon"><path d="M22.56 16.938l-5.508-5.5a1.493 1.493 0 0 0-2.116.003 1.502 1.502 0 0 0 .004 2.121L19.384 18l-4.444 4.438A1.502 1.502 0 0 0 15.996 25c.382 0 .764-.145 1.056-.438l5.508-5.5a1.502 1.502 0 0 0 0-2.125z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default IPadLayout
