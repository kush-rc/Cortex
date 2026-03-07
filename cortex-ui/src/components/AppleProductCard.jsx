import React from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import './AppleProductCard.css'

const AppleProductCard = ({ product }) => {
    const { addToCompare, removeFromCompare, isInCompare, canCompare } = useCompare()

    // Helper to safety get specs
    const specs = product.specs || {}
    const chip = product.chip || specs.Chip || ''
    const display = product.display || specs.Display || ''

    const getColors = (name, category, dbColors) => {
        if (dbColors && dbColors.length > 0) {
            const colorMap = {
                'Cosmic Orange': '#f05a28', 'Deep Blue': '#272d3e', 'Silver': '#e3e4e6',
                'Titanium Black': '#454545', 'Titanium White': '#f2f2f2', 'Titanium Gold': '#d4af37',
                'Sky Blue': '#aebccf', 'Light Gold': '#e6d7b3', 'Cloud White': '#fbf7f4',
                'Space Black': '#2e3642', 'Midnight': '#1d2327', 'Starlight': '#faf0e6',
                'Lavender': '#E5DDEA', 'Sage': '#CAD6C8', 'Mist Blue': '#67a0d4',
                'Pink': '#f2d4cd', 'Teal': '#008080', 'Ultramarine': '#3d5ba9',
                'White': '#ffffff', 'Black': '#1d1d1f', 'Space Grey': '#535355',
                'Rose Gold': '#f7d1d1', 'Jet Black': '#0a0a0a', 'Natural': '#d1cfc8',
                'Slate': '#4a4c4e', 'Gold': '#e6d7b3', 'Purple': '#d8a9b3',
                'Yellow': '#f9e34c', 'Green': '#668770',
            }
            return dbColors.map(c => colorMap[c] || c)
        }
    }

    const colors = getColors(product.name, product.category, product.colors) || []
    const formattedPrice = `From ₹${product.price?.toLocaleString('en-IN')}`
    const emiString = product.financing || (() => {
        const emiVal = Math.round(product.price / 6 * 1.08)
        return `or ₹${emiVal.toLocaleString('en-IN')}/mo. for 6 mo.`
    })()

    const inCompare = isInCompare(product.id || product._id)
    const can = canCompare(product)

    const handleCompareToggle = (e) => {
        e.preventDefault()
        if (inCompare) {
            removeFromCompare(product.id || product._id)
        } else if (can) {
            addToCompare(product)
        }
    }

    return (
        <div className={`apple-product-card ${inCompare ? 'apple-product-card--in-compare' : ''}`}>
            <div className="apple-card-image-wrapper">
                <img src={product.image || `${import.meta.env.VITE_API_URL || ""}/static/placeholder.png`} alt={product.name} className="apple-card-image" />
            </div>

            <div className="apple-card-swatches">
                {colors.map((color, i) => (
                    <span key={i} className="apple-swatch" style={{ backgroundColor: color }}></span>
                ))}
                {colors.length > 7 && <span className="apple-swatch-more">+</span>}
            </div>

            <div className="apple-card-content">
                <h3 className="apple-card-title">{product.name}</h3>
                {chip && <div className="apple-card-chip">{chip}</div>}

                <p className="apple-card-desc">{product.desc}</p>

                <div className="apple-card-pricing">
                    <p className="apple-price">{formattedPrice}*</p>
                    <p className="apple-emi">{emiString}**</p>
                </div>

                <div className="apple-card-actions-wrapper">
                    <div className="apple-card-actions">
                        <Link to={`/product/${product.id}`} className="apple-btn-learn">Learn more</Link>
                        <Link to={`/product/${product.id}`} className="apple-btn-buy">Buy <span>&gt;</span></Link>
                    </div>

                    {/* Compare button */}
                    <button
                        className={`apple-compare-btn ${inCompare ? 'in-compare' : ''} ${!can && !inCompare ? 'compare-disabled' : ''}`}
                        onClick={handleCompareToggle}
                        title={!can && !inCompare ? 'Compare list is full or category mismatch' : inCompare ? 'Remove from compare' : 'Add to compare'}
                    >
                        {inCompare ? '✓ In Compare' : !can ? '+ Compare' : '+ Compare'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppleProductCard
