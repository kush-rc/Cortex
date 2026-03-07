import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import './ComparePage.css'

const formatComplexArray = (val) => {
    if (!val) return '—';
    if (!Array.isArray(val)) return val;
    return (
        <ul className="compare-spec-list">
            {val.map((item, idx) => {
                if (typeof item === 'string') return <li key={idx}>{item}</li>;
                return (
                    <li key={idx}>
                        <strong>{item.name}</strong>
                        {item.description && <span className="compare-spec-desc">{item.description}</span>}
                    </li>
                );
            })}
        </ul>
    );
};

const SPEC_ROWS = [
    { label: 'Price', key: 'price', format: v => v ? `₹${v.toLocaleString('en-IN')}` : '—' },
    { label: 'Chip Options', key: 'chips', format: formatComplexArray },
    { label: 'Base Chip', key: 'chip', format: v => v || '—' },
    { label: 'Display', key: 'display', format: v => v || '—' },
    { label: 'Display Finishes', key: 'display_finishes', format: formatComplexArray },
    { label: 'Materials', key: 'materials', format: formatComplexArray },
    { label: 'Connectivity', key: 'connectivity', format: formatComplexArray },
    { label: 'Storage', key: 'storage', format: v => Array.isArray(v) ? v.join(', ') : (v || '—') },
    { label: 'RAM / Memory', key: 'memory', format: v => Array.isArray(v) ? v.join(', ') : (v || '—') },
    { label: 'Audio', key: 'audio', format: formatComplexArray },
    { label: 'Video', key: 'video', format: formatComplexArray },
    { label: 'Assistant', key: 'assistant', format: formatComplexArray },
    { label: 'Smart Home', key: 'smart_home', format: formatComplexArray },
    { label: 'Remote', key: 'remote', format: formatComplexArray },
    { label: 'Health Features', key: 'health', format: formatComplexArray },
    { label: 'Safety Features', key: 'safety', format: formatComplexArray },
    { label: 'Water Resistance', key: 'water_resistance', format: v => v || '—' },
    { label: 'Battery', key: 'battery', format: v => v || '—' },
    { label: 'Camera', key: 'camera', format: v => v || '—' },
    { label: 'OS', key: 'os', format: v => v || '—' },
]

const CATEGORY_MAP = {
    iphone: 'iPhone',
    mac: 'Mac',
    ipad: 'iPad',
    watch: 'Apple Watch',
    airpods: 'AirPods',
    'tv-home': 'TV & Home',
    accessories: 'Accessories',
}

export default function ComparePage() {
    const { compareList, compareCategory, removeFromCompare, clearCompare } = useCompare()
    const [products, setProducts] = useState([])
    const [categoryProducts, setCategoryProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Load compare list products from backend if IDs are available
    useEffect(() => {
        if (compareList.length === 0) {
            setProducts([])
            return
        }
        const ids = compareList.map(p => p.id || p._id).filter(Boolean).join(',')
        if (!ids) {
            setProducts(compareList) // fall back to context data
            return
        }
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/products/compare?ids=${ids}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setProducts(data.products)
                else setProducts(compareList)
            })
            .catch(() => setProducts(compareList))
            .finally(() => setLoading(false))
    }, [compareList])

    // Load all products in the locked category so the user can browse and add more
    useEffect(() => {
        const cat = compareCategory || selectedCategory
        if (!cat) return
        fetch(`${import.meta.env.VITE_API_URL || ""}/api/products?category=${cat}`)
            .then(r => r.json())
            .then(data => setCategoryProducts(data.products || []))
            .catch(() => { })
    }, [compareCategory, selectedCategory])

    const filteredAvailable = categoryProducts.filter(
        p => !compareList.find(c => (c.id || c._id) === (p.id || p._id)) && compareList.length < 3
    )

    const resolveVal = (product, key) => {
        const direct = product[key]
        if (direct !== undefined && direct !== null && direct !== '') return direct
        const fromSpecs = product?.specs?.[key.charAt(0).toUpperCase() + key.slice(1)]
        return fromSpecs ?? null
    }

    return (
        <div className="compare-page">
            {/* Header */}
            <div className="compare-hero">
                <div className="compare-hero__inner">
                    <h1 className="compare-hero__title">Compare</h1>
                    <p className="compare-hero__sub">
                        See how products stack up side-by-side.
                    </p>
                    {compareList.length > 0 && (
                        <button className="compare-clear-btn" onClick={clearCompare}>
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="compare-container">

                {/* Empty state — pick a category */}
                {compareList.length === 0 && (
                    <div className="compare-empty">
                        <div className="compare-empty__icon">⊕</div>
                        <h2>Start Comparing</h2>
                        <p>Choose a product category to begin.</p>
                        <div className="compare-category-pills">
                            {Object.entries(CATEGORY_MAP).map(([slug, label]) => (
                                <button
                                    key={slug}
                                    className={`compare-pill ${selectedCategory === slug ? 'active' : ''}`}
                                    onClick={() => { setSelectedCategory(slug) }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {selectedCategory && categoryProducts.length > 0 && (
                            <div className="compare-pick-grid">
                                <p className="compare-pick-label">Select a product to start comparing:</p>
                                <div className="compare-mini-grid">
                                    {categoryProducts.slice(0, 8).map(p => (
                                        <div key={p.id || p._id} className="compare-mini-card"
                                            onClick={() => {
                                                const { addToCompare, isInCompare, canCompare } = window.__compareCtx || {}
                                            }}
                                        >
                                            <img src={p.image} alt={p.name} />
                                            <p>{p.name}</p>
                                            <AddBrowseButton product={p} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Products selected — show compare columns */}
                {compareList.length > 0 && (
                    <>
                        {/* Product cards row */}
                        <div className="compare-cols" style={{ '--col-count': Math.max(compareList.length, 2) }}>
                            {compareList.map((product, index) => (
                                <div key={product.id || product._id} className="compare-product-col">
                                    <div className="compare-product-header">
                                        <div className="compare-product-img-wrap">
                                            <img
                                                src={product.image || `${import.meta.env.VITE_API_URL || ""}/static/placeholder.png`}
                                                alt={product.name}
                                                className="compare-product-img"
                                            />
                                        </div>
                                        <h3 className="compare-product-name">{product.name}</h3>
                                        <p className="compare-product-price">
                                            From ₹{product.price?.toLocaleString('en-IN')}
                                        </p>
                                        <div className="compare-product-actions">
                                            <Link to={`/product/${product.id || product._id}`} className="compare-btn-learn">
                                                Learn more
                                            </Link>
                                            <button
                                                className="compare-btn-remove"
                                                onClick={() => removeFromCompare(product.id || product._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add product slot */}
                            {compareList.length < 3 && (
                                <div className="compare-product-col compare-product-col--add">
                                    <div className="compare-add-slot">
                                        <div className="compare-add-icon">+</div>
                                        <p>Add a {CATEGORY_MAP[compareCategory] || 'product'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="compare-section-divider">
                            <span>Specifications</span>
                        </div>

                        {/* Spec Table */}
                        <div className="compare-table">
                            {SPEC_ROWS.map(row => {
                                const values = compareList.map(p => {
                                    const full = products.find(fp => (fp.id || fp._id) === (p.id || p._id)) || p
                                    return resolveVal(full, row.key)
                                })
                                // Skip rows where ALL values are missing
                                if (values.every(v => !v)) return null
                                return (
                                    <div className="compare-table-row" key={row.key}>
                                        <div className="compare-table-label">{row.label}</div>
                                        <div className="compare-table-values">
                                            {compareList.map((p, i) => (
                                                <div key={p.id || p._id} className="compare-table-cell">
                                                    {row.format(values[i])}
                                                </div>
                                            ))}
                                            {compareList.length < 3 && (
                                                <div className="compare-table-cell compare-table-cell--empty">—</div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Browse more from same category */}
                        {filteredAvailable.length > 0 && (
                            <div className="compare-add-more">
                                <h3 className="compare-add-more__title">
                                    Add another {CATEGORY_MAP[compareCategory] || 'product'}
                                </h3>
                                <div className="compare-mini-grid">
                                    {filteredAvailable.slice(0, 6).map(p => (
                                        <div key={p.id || p._id} className="compare-mini-card">
                                            <img src={p.image} alt={p.name} />
                                            <p>{p.name}</p>
                                            <AddBrowseButton product={p} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// Small inner component to avoid calling hook in different order
function AddBrowseButton({ product }) {
    const { addToCompare, isInCompare, canCompare } = useCompare()
    const inList = isInCompare(product.id || product._id)
    const can = canCompare(product)

    return (
        <button
            className={`compare-mini-add-btn ${inList ? 'added' : ''} ${!can && !inList ? 'disabled' : ''}`}
            onClick={() => { if (can) addToCompare(product) }}
            disabled={!can && !inList}
        >
            {inList ? '✓ Added' : can ? '+ Compare' : 'Not available'}
        </button>
    )
}
