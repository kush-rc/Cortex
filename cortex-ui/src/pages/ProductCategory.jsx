import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppleProductCard from '../components/AppleProductCard'
import IPadLayout from '../components/IPadLayout'
import CategoryRibbon from '../components/CategoryRibbon'
import MacCategoryNav from '../components/MacCategoryNav'
import TVHomeLayout from '../components/TVHomeLayout'
import './ProductCategory.css'

const ProductCategory = ({ category }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // For Mac page: all, laptops, desktops, displays

    // Map category slugs to display titles
    const categoryTitles = {
        iphone: 'iPhone',
        mac: 'Mac',
        ipad: 'iPad',
        watch: 'Apple Watch',
        airpods: 'AirPods',
        'tv-home': 'TV & Home',
        accessories: 'Accessories'
    }

    useEffect(() => {
        fetchProducts()
    }, [category])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            // Use relative path for Vite proxy
            const response = await fetch(`/api/products?category=${category}`)
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Deduplicate Mac Products (Show only one representative per line)
    const getMacLine = (name) => {
        const n = name.toLowerCase();
        if (n.includes('air')) return 'air';
        if (n.includes('mac pro')) return 'mac pro';
        if (n.includes('pro')) return 'pro';
        if (n.includes('imac')) return 'imac';
        if (n.includes('mini')) return 'mini';
        if (n.includes('studio')) return 'studio';
        return 'other';
    };

    const uniqueMacProducts = [];
    if (category === 'mac') {
        const seenLines = new Set();
        products.forEach(p => {
            const line = getMacLine(p.name);
            if (line !== 'other' && !seenLines.has(line)) {
                seenLines.add(line);
                uniqueMacProducts.push(p);
            }
        });
        // Sort them to match typical apple order: Air, Pro, iMac, Mini, Studio, Mac Pro
        const order = ['air', 'pro', 'imac', 'mini', 'studio', 'mac pro'];
        uniqueMacProducts.sort((a, b) => {
            return order.indexOf(getMacLine(a.name)) - order.indexOf(getMacLine(b.name));
        });
    }

    // Filter Logic
    let baseList = category === 'mac' ? uniqueMacProducts : products;

    // Hide explicit AI-only standalone variants from the main grid UI
    baseList = baseList.filter(p => !['iPhone 16 Plus', 'iPhone 17 Pro Max', 'MacBook Air 15"', 'MacBook Pro 16"'].includes(p.name));

    const filteredProducts = baseList.filter(p => {
        if (category !== 'mac' || filter === 'all') return true;
        const name = p.name.toLowerCase();
        if (filter === 'laptops') return name.includes('book');
        if (filter === 'desktops') return name.includes('imac') || name.includes('mini') || name.includes('studio') || name.includes('pro') && !name.includes('book'); // Mac Pro is desktop, MacBook Pro is laptop
        if (filter === 'displays') return name.includes('display');
        return true;
    });

    return (
        <div className={`category-page ${category}-page`}>

            <div className="container">
                <header className="category-header">
                    <h1 className="category-title">{categoryTitles[category] || 'Store'}</h1>
                </header>
            </div>

            {loading ? (
                <div className="container">
                    <div className="product-grid">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="skeleton-card">
                                <div className="skeleton-shimmer"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : category === 'tv-home' ? (
                <TVHomeLayout products={products} />
            ) : (
                <div className="container">
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <AppleProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
            {!loading && products.length === 0 && (
                <div className="empty-category">
                    <p className="headline-small">No products found in this category.</p>
                    <Link to="/" className="btn-secondary">Go to Home</Link>
                </div>
            )}
        </div>
    )
}

export default ProductCategory
