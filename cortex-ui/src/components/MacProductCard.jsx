import React from 'react'
import { Link } from 'react-router-dom'
import './MacProductCard.css'

const MacProductCard = ({ product }) => {
    // Derived Data Mocking using User's Exact specs and Images
    const getProductDetails = (name) => {
        const n = name.toLowerCase();

        // MacBook Air
        if (n.includes('air')) return {
            chip: 'M4 chip', // User requested M4 for Air
            title: 'MacBook Air 13” and 15”',
            desc: 'Strikingly thin and fast so you can work, play or create anywhere.',
            price: 'From ₹99900.00***', // String to include *
            emi: 'or ₹14983.00/mo. for 6 mo.****', // String
            // Exact image path from file system check found: 'mac13&15_1.jpg' in 'Macbook Air 13'' and 15'''
            // URL Encode: ' ' -> %20, '&' -> %26, '' -> %27%27? Or literal.
            // Let's try literal first, but most servers need %20.
            imageOverride: '/static/product_images/Mac/Macbook%20Air%2013%27%27%20and%2015%27%27/mac13%2615_1.jpg',
            colors: ['#2e3642', '#f0e5d3', '#7d7e80', '#e3e4e6']
        };

        // MacBook Pro
        if (n.includes('pro') && !n.includes('mac pro')) return { // Exclude Mac Pro tower
            chip: 'M5, M4 Pro or M4 Max chip', // User screenshot text
            title: 'MacBook Pro 14” and 16”',
            desc: 'The most advanced Mac laptops for demanding workflows.',
            price: 'From ₹169900.00***',
            emi: 'or ₹26650.00/mo. for 6 mo.****',
            imageOverride: '/static/product_images/Mac/MacBook%20Pro/macpro_1.webp',
            colors: ['#000000', '#e3e4e6'] // Space Black, Silver (User screenshot has 2 dots? Or 3. Let's do 2-3)
        };

        // iMac
        if (n.includes('imac')) return {
            chip: 'M4 chip',
            title: 'iMac',
            desc: 'A stunning all-in-one desktop for creativity and productivity.',
            price: 'From ₹134900.00***',
            emi: 'or ₹21650.00/mo. for 6 mo.****',
            imageOverride: '/static/product_images/Mac/imac/imac_1.jpg',
            colors: ['#355678', '#668770', '#E5A599', '#E6E7E9', '#E9E684', '#E1894D', '#9A80BD']
        };

        // Mac mini
        if (n.includes('mini')) return {
            chip: 'M4 or M4 Pro chip',
            title: 'Mac mini',
            desc: 'The mini-est, most affordable Mac with mighty performance.',
            price: 'From ₹59900.00***',
            emi: 'or ₹9317.00/mo. for 6 mo.****',
            imageOverride: '/static/product_images/Mac/Macmini/macmini_1.jpg',
            colors: ['#e3e4e6'] // Silver
        };

        // Mac Studio
        if (n.includes('studio')) return {
            chip: 'M4 Max or M3 Ultra chip', // User screenshot text
            title: 'Mac Studio',
            desc: 'Powerful performance and extensive connectivity for pro workflows.',
            price: 'From ₹214900.00***',
            emi: 'or ₹34150.00/mo. for 6 mo.****',
            imageOverride: '/static/product_images/Mac/Macstudio/macs_1.jpg', // macs_1.jpg
            colors: ['#e3e4e6']
        };

        // Mac Pro
        if (n.includes('mac pro')) return {
            chip: 'M2 Ultra chip',
            title: 'Mac Pro',
            desc: 'A pro workstation with PCIe expansion for demanding workflows.',
            price: 'From ₹729900.00***',
            emi: 'or ₹112700.00/mo. for 6 mo.****',
            imageOverride: '/static/product_images/Mac/Macpro/macpro_1.jpg',
            colors: ['#e3e4e6']
        };

        // Default
        return {
            chip: 'Apple Silicon',
            title: product.name,
            desc: product.tagline || 'Amazing power.',
            price: `From ₹${product.price?.toLocaleString('en-IN')}.00`,
            emi: '',
            imageOverride: product.image,
            colors: []
        };
    };

    const details = getProductDetails(product.name);

    // If overriding image, check if it works, otherwise fallback? 
    // We trust the override for now.
    const imageSrc = details.imageOverride || product.image;

    return (
        <div className="mac-product-card">
            <div className="mac-card-image-wrapper">
                <img src={imageSrc} alt={details.title} className="mac-card-image" />
            </div>

            <div className="mac-card-swatches">
                {details.colors.map((color, i) => (
                    <span key={i} className="mac-swatch" style={{ backgroundColor: color }}></span>
                ))}
                {details.colors.length > 7 && <span className="mac-swatch-more">+</span>}
            </div>

            <div className="mac-card-content">
                <h3 className="mac-card-title">{details.title}</h3>
                <div className="mac-card-chip">{details.chip}</div>

                <p className="mac-card-desc">{details.desc}</p>

                <div className="mac-card-pricing">
                    <p className="mac-price">{details.price}</p>
                    <p className="mac-emi">{details.emi}</p>
                </div>

                <div className="mac-card-actions">
                    <Link to={`/product/${product.id}`} className="mac-btn-learn">Learn more</Link>
                    <Link to={`/product/${product.id}`} className="mac-btn-buy">Buy <span>&gt;</span></Link>
                </div>
            </div>
        </div>
    )
}

export default MacProductCard
